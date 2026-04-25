import { z } from 'zod/v4'
import type { UIMessage } from 'ai'

export const contentCategorySchema = z.enum([
	'background',
	'skills',
	'workflow',
	'projects',
	'philosophy',
	'experience'
])

export type ContentCategory = z.infer<typeof contentCategorySchema>

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface ChatMessageMetadata {
	confidence: ConfidenceLevel
	sources: ContentCategory[]
	suggestedFollowUps?: string[]
	error?: { message: string }
}

export const chatMessageMetadataSchema = z.object({
	confidence: z.enum(['high', 'medium', 'low']),
	sources: z.array(contentCategorySchema),
	suggestedFollowUps: z.array(z.string()).optional(),
	error: z.object({ message: z.string() }).optional()
})

// ===== Email contact-form schemas =====

const emailFieldsRequired = z.object({
	name: z.string().min(1).max(100),
	email: z.email().max(100),
	company: z.string().min(1).max(100),
	intent: z.string().min(1).max(500)
})

export const emailContactSchema = emailFieldsRequired.partial()
export type EmailContactInput = z.infer<typeof emailContactSchema>

export const emailContactResultSchema = z.object({
	fields: emailContactSchema,
	missing: z.array(z.enum(['name', 'email', 'company', 'intent'])),
	ready: z.boolean()
})
export type EmailContactResult = z.infer<typeof emailContactResultSchema>

export const emailDraftSchema = emailFieldsRequired
export type EmailDraftInput = z.infer<typeof emailDraftSchema>

export const emailDraftResultSchema = z.object({
	subject: z.string().min(1).max(120),
	body: z.string().min(1).max(4000)
})
export type EmailDraftResult = z.infer<typeof emailDraftResultSchema>

export const emailSendSchema = emailFieldsRequired.extend({
	body: z.string().min(1).max(4000)
})
export type EmailSendInput = z.infer<typeof emailSendSchema>

export const emailStageSchema = z.object({
	stageName: z.enum([
		'validate-contact',
		'draft-snapshot',
		'safety-check',
		'resend-call',
		'delivered'
	]),
	status: z.enum(['pending', 'running', 'done', 'failed']),
	detail: z.string().optional()
})
export type EmailStage = z.infer<typeof emailStageSchema>

export type EmailSendToolResult =
	| { ok: true; id: string }
	| {
			ok: false
			reason: 'rate_limit' | 'validation_failed' | 'resend_failed'
			message: string
	  }

// Tool surface lives here so client code can import the typed ChatUIMessage
// generic without depending on the server-only email-tools module.
export type EmailTools = {
	collect_contact_info: { input: EmailContactInput; output: EmailContactResult }
	draft_email: { input: EmailDraftInput; output: EmailDraftResult }
	send_email: { input: EmailSendInput; output: EmailSendToolResult }
}

export type EmailDataParts = {
	'email-stage': EmailStage
}

export type ChatUIMessage = UIMessage<ChatMessageMetadata, EmailDataParts, EmailTools>

export const CONFIDENCE_THRESHOLDS = { high: 0.45, medium: 0.25 } as const

export const SECTION_MAP: Record<ContentCategory, string> = {
	workflow: '#ai-workflow',
	projects: '#projects',
	skills: '#ai-workflow',
	background: '',
	philosophy: '',
	experience: '#experience'
}

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
	workflow: 'AI Workflow',
	projects: 'Projects',
	skills: 'Skills',
	background: 'Background',
	philosophy: 'Philosophy',
	experience: 'Experience'
}

export const GREETING_PATTERN =
	/^\s*(hi|hello|hey|howdy|greetings|good\s*(morning|afternoon|evening)|what'?s\s*up|yo|sup)\b/i
