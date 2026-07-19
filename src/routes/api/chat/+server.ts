import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createOpenAI } from '@ai-sdk/openai'
import {
	streamText,
	stepCountIs,
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type UIMessage,
	type UIMessageStreamWriter
} from 'ai'
import { z } from 'zod/v4'
import { env } from '$env/dynamic/private'
import { embedQuery, retrieveContext, buildSystemPrompt } from '$lib/server/rag'
import { isGreeting, getGreetingResponse, getSuggestedFollowUps } from '$lib/server/query-router'
import { checkRate } from '$lib/server/rate-limit'
import { createEmailTools } from '$lib/server/email-tools'
import type { ChatMessageMetadata } from '$lib/types/chat'

// --- Abuse prevention constants ---
const MAX_MESSAGE_LENGTH = 500
const MAX_CONVERSATION_LENGTH = 10
// Hard cap on incoming payload size; the server still slices to MAX_CONVERSATION_LENGTH.
const MAX_REQUEST_MESSAGES = 100
// Sized for multi-step tool flows (draft + send), not just a single text reply.
const MAX_OUTPUT_TOKENS = 800
const MAX_TOOL_STEPS = 8

// Loose schema: top-level shape is validated, but message/part objects pass through
// extra fields (id, metadata, tool-call/tool-result fields) so convertToModelMessages
// can reconstruct the full UI message — including tool history — for the model.
const chatRequestSchema = z.object({
	messages: z
		.array(
			z.looseObject({
				id: z.string(),
				role: z.enum(['user', 'assistant', 'system']),
				parts: z.array(z.looseObject({ type: z.string() })).optional()
			})
		)
		.min(1)
		.max(MAX_REQUEST_MESSAGES)
})

type ChatRequestMessage = z.infer<typeof chatRequestSchema>['messages'][number]

function extractLastUserText(messages: ChatRequestMessage[]): string {
	for (let i = messages.length - 1; i >= 0; i--) {
		const msg = messages[i]
		if (msg.role !== 'user') continue
		const text = (msg.parts ?? [])
			.filter((p): p is { type: 'text'; text?: string } => p.type === 'text')
			.map((p) => p.text ?? '')
			.join('')
		return text
	}
	return ''
}

const EMAIL_TOOL_PART_TYPES = [
	'tool-collect_contact_info',
	'tool-draft_email',
	'tool-send_email'
]

// Detect whether an email-tool call has already happened in prior turns. When true,
// the low-confidence Path B short-circuit is suppressed so the email flow is not
// interrupted by a decline message on a turn whose embedding score is weak.
function isEmailModeActive(messages: ChatRequestMessage[]): boolean {
	for (const msg of messages) {
		if (msg.role !== 'assistant') continue
		for (const part of msg.parts ?? []) {
			if (EMAIL_TOOL_PART_TYPES.includes(part.type)) return true
		}
	}
	return false
}

function writeManualMessage(
	writer: UIMessageStreamWriter,
	text: string,
	metadata: ChatMessageMetadata
) {
	const partId = crypto.randomUUID()
	writer.write({ type: 'start', messageMetadata: metadata })
	writer.write({ type: 'text-start', id: partId })
	writer.write({ type: 'text-delta', id: partId, delta: text })
	writer.write({ type: 'text-end', id: partId })
	writer.write({ type: 'finish', messageMetadata: metadata })
}

// Always emit a terminal `finish` chunk, even when the execute IIFE throws.
// Without this guard the client hangs in `streaming` state because the stream
// closes without a sentinel. Reference:
// ~/.claude/knowledge/debugging-readable-stream-async-iife-swallows-errors.md
function writeTerminalErrorFinish(
	writer: UIMessageStreamWriter,
	err: unknown,
	baseMetadata: ChatMessageMetadata
) {
	console.error('[chat] terminal finish on error', err)
	const message = err instanceof Error ? err.message : 'Unknown error'
	writer.write({
		type: 'finish',
		messageMetadata: { ...baseMetadata, error: { message } }
	})
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Rate limiting
	const clientIp = getClientAddress()
	if (!checkRate('chat', clientIp, 10, 60_000)) {
		return json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
	}

	// Validate API key
	const apiKey = env.MOONSHOT_API_KEY
	if (!apiKey) {
		return json({ error: 'Chat service is not configured.' }, { status: 503 })
	}

	try {
		const body = await request.json().catch(() => null)
		const parsed = chatRequestSchema.safeParse(body)
		if (!parsed.success) {
			return json({ error: 'Invalid request body.' }, { status: 400 })
		}

		const { messages } = parsed.data
		const recentMessages = messages.slice(-MAX_CONVERSATION_LENGTH)

		const query = extractLastUserText(recentMessages)
		if (!query) {
			return json({ error: 'No user message found.' }, { status: 400 })
		}

		// Reject overly long messages
		if (query.length > MAX_MESSAGE_LENGTH) {
			return json(
				{ error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` },
				{ status: 400 }
			)
		}

		// Path A: Greeting -- no LLM call
		if (isGreeting(query)) {
			const metadata: ChatMessageMetadata = {
				confidence: 'high',
				sources: [],
				suggestedFollowUps: getSuggestedFollowUps([], 3)
			}
			const stream = createUIMessageStream({
				execute: ({ writer }) => {
					try {
						writeManualMessage(writer, getGreetingResponse(), metadata)
					} catch (err) {
						writeTerminalErrorFinish(writer, err, metadata)
					}
				}
			})
			return createUIMessageStreamResponse({ stream })
		}

		// RAG pipeline: embed -> retrieve
		const queryEmbedding = await embedQuery(query)
		const retrieval = await retrieveContext(queryEmbedding)

		// Path B: Low confidence -- polite decline, no LLM call.
		// Suppressed when email-mode is active: a low-similarity reply mid-flow
		// (e.g. "my email is x@y.com") would otherwise interrupt the email flow
		// with a generic decline.
		if (retrieval.confidence === 'low' && !isEmailModeActive(recentMessages)) {
			const metadata: ChatMessageMetadata = {
				confidence: 'low',
				sources: retrieval.categories,
				suggestedFollowUps: getSuggestedFollowUps(retrieval.categories, 3)
			}
			const declineText =
				"I don't have enough information to answer that confidently. I'm best at questions about Wen's AI workflow, technical skills, projects, and engineering philosophy. Try one of the suggestions below!"
			const stream = createUIMessageStream({
				execute: ({ writer }) => {
					try {
						writeManualMessage(writer, declineText, metadata)
					} catch (err) {
						writeTerminalErrorFinish(writer, err, metadata)
					}
				}
			})
			return createUIMessageStreamResponse({ stream })
		}

		// Path C: Medium/High confidence -- LLM call
		const metadata: ChatMessageMetadata = {
			confidence: retrieval.confidence,
			sources: retrieval.categories
		}
		const systemPrompt = buildSystemPrompt(retrieval.contextText)

		const moonshot = createOpenAI({
			apiKey,
			baseURL: 'https://api.moonshot.ai/v1'
		})

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				try {
					writer.write({ type: 'start', messageMetadata: metadata })

					const tools = createEmailTools(writer, clientIp)
					const modelMessages = await convertToModelMessages(recentMessages as UIMessage[])

					const result = streamText({
						model: moonshot.chat('kimi-k2.6'),
						system: systemPrompt,
						messages: modelMessages,
						tools,
						stopWhen: stepCountIs(MAX_TOOL_STEPS),
						maxOutputTokens: MAX_OUTPUT_TOKENS
					})

					writer.merge(
						result.toUIMessageStream({ sendStart: false, sendFinish: false })
					)

					// Wait for LLM stream to complete before sending finish with metadata
					await result.text
					const finishReason = await result.finishReason
					if (finishReason === 'length') {
						const noteId = crypto.randomUUID()
						writer.write({ type: 'text-start', id: noteId })
						writer.write({ type: 'text-delta', id: noteId, delta: '\n\n_(response truncated)_' })
						writer.write({ type: 'text-end', id: noteId })
					}
					writer.write({ type: 'finish', messageMetadata: metadata })
				} catch (err) {
					writeTerminalErrorFinish(writer, err, metadata)
				}
			}
		})

		return createUIMessageStreamResponse({ stream })
	} catch (err) {
		console.error('Chat API error:', err)
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
	}
}

export const config = {
	runtime: 'nodejs22.x',
	maxDuration: 30
}
