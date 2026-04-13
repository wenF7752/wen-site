import { z } from 'zod/v4'
import type { UIMessage } from 'ai'

export type ContentCategory = 'background' | 'skills' | 'workflow' | 'projects' | 'philosophy'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface ChatMessageMetadata {
	confidence: ConfidenceLevel
	sources: ContentCategory[]
	suggestedFollowUps?: string[]
}

export type ChatUIMessage = UIMessage<ChatMessageMetadata>

export const chatMessageMetadataSchema = z.object({
	confidence: z.enum(['high', 'medium', 'low']),
	sources: z.array(z.enum(['background', 'skills', 'workflow', 'projects', 'philosophy'])),
	suggestedFollowUps: z.array(z.string()).optional()
})

export const CONFIDENCE_THRESHOLDS = { high: 0.45, medium: 0.25 } as const

export const SECTION_MAP: Record<ContentCategory, string> = {
	workflow: '#ai-workflow',
	projects: '#projects',
	skills: '#ai-workflow',
	background: '',
	philosophy: ''
}

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
	workflow: 'AI Workflow',
	projects: 'Projects',
	skills: 'Skills',
	background: 'Background',
	philosophy: 'Philosophy'
}

export const GREETING_PATTERN =
	/^\s*(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening)|what'?s\s*up|yo|sup)\b/i
