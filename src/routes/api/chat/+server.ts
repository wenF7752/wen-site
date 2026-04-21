import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createOpenAI } from '@ai-sdk/openai'
import {
	streamText,
	createUIMessageStream,
	createUIMessageStreamResponse,
	type UIMessageStreamWriter
} from 'ai'
import { z } from 'zod/v4'
import { env } from '$env/dynamic/private'
import { embedQuery, retrieveContext, buildSystemPrompt } from '$lib/server/rag'
import { isGreeting, getGreetingResponse, getSuggestedFollowUps } from '$lib/server/query-router'
import type { ChatMessageMetadata } from '$lib/types/chat'

// --- Abuse prevention constants ---
const RATE_LIMIT = 10 // requests per window per IP
const RATE_WINDOW = 60 * 1000 // 1 minute
const MAX_MESSAGE_LENGTH = 500 // chars per user message
const MAX_CONVERSATION_LENGTH = 10 // max messages in history
const MAX_REQUEST_MESSAGES = 100 // hard cap on payload size; server still slices to MAX_CONVERSATION_LENGTH
const MAX_OUTPUT_TOKENS = 300 // cap LLM response cost

const chatRequestSchema = z.object({
	messages: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant', 'system']),
				parts: z
					.array(
						z.object({
							type: z.string(),
							text: z.string().optional()
						})
					)
					.optional()
			})
		)
		.min(1)
		.max(MAX_REQUEST_MESSAGES)
})

// In-memory rate limiting (best-effort on serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
	const now = Date.now()
	const entry = rateLimitMap.get(ip)

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
		return true
	}

	if (entry.count >= RATE_LIMIT) {
		return false
	}

	entry.count++
	return true
}

type ChatRequestMessage = z.infer<typeof chatRequestSchema>['messages'][number]

// Convert UI messages (parts format) to model messages (content format)
function toModelMessages(uiMessages: ChatRequestMessage[]) {
	return uiMessages.map((msg) => {
		const text =
			msg.parts
				?.filter((p) => p.type === 'text')
				.map((p) => p.text ?? '')
				.join('') || ''
		return { role: msg.role as 'user' | 'assistant', content: text }
	})
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

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Rate limiting
	const clientIp = getClientAddress()
	if (!checkRateLimit(clientIp)) {
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

		// Convert UI messages to model messages
		const modelMessages = toModelMessages(recentMessages)

		// Get latest user query text for RAG
		const lastUserMsg = modelMessages.filter((m) => m.role === 'user').pop()
		if (!lastUserMsg || !lastUserMsg.content) {
			return json({ error: 'No user message found.' }, { status: 400 })
		}

		// Reject overly long messages
		if (lastUserMsg.content.length > MAX_MESSAGE_LENGTH) {
			return json(
				{ error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` },
				{ status: 400 }
			)
		}

		const query = lastUserMsg.content

		// Path A: Greeting -- no LLM call
		if (isGreeting(query)) {
			const metadata: ChatMessageMetadata = {
				confidence: 'high',
				sources: [],
				suggestedFollowUps: getSuggestedFollowUps([], 3)
			}
			const stream = createUIMessageStream({
				execute: ({ writer }) => {
					writeManualMessage(writer, getGreetingResponse(), metadata)
				}
			})
			return createUIMessageStreamResponse({ stream })
		}

		// RAG pipeline: embed -> retrieve
		const queryEmbedding = await embedQuery(query)
		const retrieval = await retrieveContext(queryEmbedding)

		// Path B: Low confidence -- polite decline, no LLM call
		if (retrieval.confidence === 'low') {
			const metadata: ChatMessageMetadata = {
				confidence: 'low',
				sources: retrieval.categories,
				suggestedFollowUps: getSuggestedFollowUps(retrieval.categories, 3)
			}
			const declineText =
				"I don't have enough information to answer that confidently. I'm best at questions about Wen's AI workflow, technical skills, projects, and engineering philosophy. Try one of the suggestions below!"
			const stream = createUIMessageStream({
				execute: ({ writer }) => {
					writeManualMessage(writer, declineText, metadata)
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
				writer.write({ type: 'start', messageMetadata: metadata })

				const result = streamText({
					model: moonshot.chat('kimi-k2-turbo-preview'),
					system: systemPrompt,
					messages: modelMessages,
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
