import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type UIMessage } from 'ai';
import { env } from '$env/dynamic/private';
import { embedQuery, retrieveContext, buildSystemPrompt } from '$lib/server/rag';

// --- Abuse prevention constants ---
const RATE_LIMIT = 10; // requests per window per IP
const RATE_WINDOW = 60 * 1000; // 1 minute
const MAX_MESSAGE_LENGTH = 500; // chars per user message
const MAX_CONVERSATION_LENGTH = 10; // max messages in history
const MAX_OUTPUT_TOKENS = 300; // cap LLM response cost

// In-memory rate limiting (best-effort on serverless)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
		return true;
	}

	if (entry.count >= RATE_LIMIT) {
		return false;
	}

	entry.count++;
	return true;
}

// Convert UI messages (parts format) to model messages (content format)
function toModelMessages(uiMessages: UIMessage[]) {
	return uiMessages.map((msg) => {
		const text =
			msg.parts
				?.filter((p) => p.type === 'text')
				.map((p) => p.text)
				.join('') || '';
		return { role: msg.role as 'user' | 'assistant', content: text };
	});
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Rate limiting
	const clientIp = getClientAddress();
	if (!checkRateLimit(clientIp)) {
		return json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
	}

	// Validate API key
	const apiKey = env.MOONSHOT_API_KEY;
	if (!apiKey) {
		return json({ error: 'Chat service is not configured.' }, { status: 503 });
	}

	try {
		const { messages } = await request.json();

		if (!messages || !Array.isArray(messages) || messages.length === 0) {
			return json({ error: 'Messages are required.' }, { status: 400 });
		}

		// Cap conversation length to prevent token bloat
		const recentMessages = messages.slice(-MAX_CONVERSATION_LENGTH);

		// Convert UI messages to model messages
		const modelMessages = toModelMessages(recentMessages);

		// Get latest user query text for RAG
		const lastUserMsg = modelMessages.filter((m) => m.role === 'user').pop();
		if (!lastUserMsg || !lastUserMsg.content) {
			return json({ error: 'No user message found.' }, { status: 400 });
		}

		// Reject overly long messages
		if (lastUserMsg.content.length > MAX_MESSAGE_LENGTH) {
			return json(
				{ error: `Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` },
				{ status: 400 }
			);
		}

		// RAG pipeline: embed -> retrieve -> build context
		const queryEmbedding = await embedQuery(lastUserMsg.content);
		const context = await retrieveContext(queryEmbedding);
		const systemPrompt = buildSystemPrompt(context);

		// Stream response from Moonshot (OpenAI-compatible chat completions API)
		const moonshot = createOpenAI({
			apiKey,
			baseURL: 'https://api.moonshot.ai/v1'
		});

		const result = streamText({
			model: moonshot.chat('kimi-k2-turbo-preview'),
			system: systemPrompt,
			messages: modelMessages,
			maxOutputTokens: MAX_OUTPUT_TOKENS
		});

		return result.toUIMessageStreamResponse();
	} catch (err) {
		console.error('Chat API error:', err);
		return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
	}
};

export const config = {
	runtime: 'nodejs22.x',
	maxDuration: 30
};
