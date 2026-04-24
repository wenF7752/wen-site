import { GREETING_PATTERN, type ContentCategory } from '$lib/types/chat'

export function isGreeting(text: string): boolean {
	return GREETING_PATTERN.test(text.trim())
}

export function getGreetingResponse(): string {
	return "Hey! I'm Wen's portfolio assistant. I can tell you about his AI workflow, technical skills, projects, and engineering philosophy. What would you like to know?"
}

const SUGGESTED_QUESTIONS: Record<ContentCategory, string[]> = {
	workflow: [
		'How does Wen use AI in his development workflow?',
		'What does the Architect-Build-Validate-Ship pipeline look like?'
	],
	skills: [
		'What AI engineering skills does Wen have?',
		'What is context engineering and harness engineering?'
	],
	projects: [
		'Tell me about the RAG chatbot on this site.',
		"What projects showcase Wen's AI skills?"
	],
	background: [
		"What is Wen's technical stack?",
		'What kind of engineer is Wen?'
	],
	philosophy: [
		"What is Wen's development philosophy?",
		'How does Wen evaluate AI-generated code?'
	],
	experience: [
		"What is Wen's current role?",
		'What has Wen built recently?'
	]
}

export function getSuggestedFollowUps(
	excludeCategories: ContentCategory[],
	count = 3
): string[] {
	const excluded = new Set(excludeCategories)
	const pool: string[] = []
	const categories = Object.keys(SUGGESTED_QUESTIONS) as ContentCategory[]

	for (const cat of categories) {
		if (!excluded.has(cat)) {
			pool.push(...SUGGESTED_QUESTIONS[cat])
		}
	}

	// Shuffle and pick
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[pool[i], pool[j]] = [pool[j], pool[i]]
	}

	return pool.slice(0, count)
}
