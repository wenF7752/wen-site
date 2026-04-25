import { Resend } from 'resend'
import { createHash } from 'node:crypto'
import { env } from '$env/dynamic/private'
import type { EmailSendInput } from '$lib/types/chat'

export type SendContactEmailResult =
	| { ok: true; id: string }
	| { ok: false; error: { name: string; message: string } }

const RECIPIENT = 'me@wenfang.dev'
// Different local part from RECIPIENT. Self-from (From == To) on a domain that
// forwards via Cloudflare Email Routing breaks DKIM alignment on the forwarded
// hop and trips spam filters at the destination mailbox.
const FROM = 'contact@wenfang.dev'
const SUBJECT_PREFIX = '[Portfolio Contact]'
const MAX_INTENT_IN_SUBJECT = 60
const MAX_SUBJECT_TOTAL = 120

export function buildSubject(name: string, intent: string): string {
	const truncatedIntent =
		intent.length > MAX_INTENT_IN_SUBJECT
			? intent.slice(0, MAX_INTENT_IN_SUBJECT - 1) + '…'
			: intent
	const subject = `${SUBJECT_PREFIX} ${name} — ${truncatedIntent}`
	return subject.length > MAX_SUBJECT_TOTAL
		? subject.slice(0, MAX_SUBJECT_TOTAL - 1) + '…'
		: subject
}

function makeIdempotencyKey(args: EmailSendInput): string {
	// Hash of (email, body) so double-clicks of the same draft within Resend's
	// 24h window dedupe automatically. Different content -> different key.
	const hash = createHash('sha256')
		.update(`${args.email}|${args.body}`)
		.digest('hex')
		.slice(0, 32)
	return `contact-email/${hash}`
}

export async function sendContactEmail(args: EmailSendInput): Promise<SendContactEmailResult> {
	const apiKey = env.RESEND_API_KEY
	if (!apiKey) {
		return { ok: false, error: { name: 'config_error', message: 'RESEND_API_KEY not set' } }
	}

	const resend = new Resend(apiKey)
	const subject = buildSubject(args.name, args.intent)

	try {
		const result = await resend.emails.send(
			{
				from: FROM,
				to: RECIPIENT,
				replyTo: args.email,
				subject,
				text: args.body
			},
			{ idempotencyKey: makeIdempotencyKey(args) }
		)

		if (result.error) {
			return {
				ok: false,
				error: { name: result.error.name, message: result.error.message }
			}
		}

		if (!result.data) {
			return {
				ok: false,
				error: { name: 'unknown', message: 'Resend returned no data' }
			}
		}

		return { ok: true, id: result.data.id }
	} catch (err) {
		// Only network/throw failures land here; SDK API errors come back via result.error.
		const message = err instanceof Error ? err.message : 'Unknown error'
		return { ok: false, error: { name: 'network_error', message } }
	}
}
