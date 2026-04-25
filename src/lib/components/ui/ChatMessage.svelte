<script lang="ts">
	import {
		CATEGORY_LABELS,
		SECTION_MAP,
		type ChatMessageMetadata,
		type ChatUIMessage,
		type ConfidenceLevel,
		type ContentCategory,
		type EmailStage
	} from '$lib/types/chat'

	interface ContactFormFields {
		name: string
		email: string
		company: string
		intent: string
	}

	interface Props {
		role: 'user' | 'assistant'
		parts: ChatUIMessage['parts']
		metadata?: ChatMessageMetadata
		showFollowUps?: boolean
		showDraftActions?: boolean
		showCollectForm?: boolean
		onSourceClick?: (sectionId: string) => void
		onSuggestionClick?: (text: string) => void
		onSubmitContactForm?: (fields: ContactFormFields) => void
		onDraftAction?: (action: 'send' | 'cancel', body?: string) => void
	}

	let {
		role,
		parts,
		metadata,
		showFollowUps = false,
		showDraftActions = false,
		showCollectForm = false,
		onSourceClick,
		onSuggestionClick,
		onSubmitContactForm,
		onDraftAction
	}: Props = $props()

	const confidenceColors: Record<ConfidenceLevel, string> = {
		high: 'bg-emerald-500',
		medium: 'bg-yellow-500',
		low: 'bg-red-500'
	}

	const confidenceTextColors: Record<ConfidenceLevel, string> = {
		high: 'text-emerald-400',
		medium: 'text-yellow-400',
		low: 'text-red-400'
	}

	function handleSourceClick(category: ContentCategory) {
		const sectionId = SECTION_MAP[category]
		if (sectionId && onSourceClick) {
			onSourceClick(sectionId)
		}
	}

	const CONTACT_FIELDS = ['name', 'email', 'company', 'intent'] as const

	const RECIPIENT_EMAIL = 'me@wenfang.dev'

	const SEND_STAGE_ORDER = [
		'validate-contact',
		'draft-snapshot',
		'safety-check',
		'resend-call',
		'delivered'
	] as const

	const SEND_STAGE_LABELS: Record<(typeof SEND_STAGE_ORDER)[number], string> = {
		'validate-contact': 'Validating contact info',
		'draft-snapshot': 'Capturing draft',
		'safety-check': 'Safety check',
		'resend-call': 'Sending via Resend',
		delivered: 'Delivered'
	}

	const STATUS_STYLES: Record<EmailStage['status'], string> = {
		pending: 'bg-white/[0.04] text-surface-500',
		running: 'bg-yellow-500/15 text-yellow-300',
		done: 'bg-emerald-500/15 text-emerald-300',
		failed: 'bg-red-500/15 text-red-300'
	}

	// Edited bodies and editing-mode flags are keyed by part index so multiple
	// draft parts in one bubble (rare but possible) edit independently.
	let editedBodies = $state<Record<number, string>>({})
	let editingPart = $state<Record<number, boolean>>({})
	let editBuffers = $state<Record<number, string>>({})

	function startEdit(partIndex: number, currentBody: string) {
		editBuffers[partIndex] = editedBodies[partIndex] ?? currentBody
		editingPart[partIndex] = true
	}

	function saveEdit(partIndex: number) {
		const next = editBuffers[partIndex]?.trim()
		if (!next) return
		editedBodies[partIndex] = next
		editingPart[partIndex] = false
	}

	function discardEdit(partIndex: number) {
		delete editBuffers[partIndex]
		delete editedBodies[partIndex]
		editingPart[partIndex] = false
	}

	function bodyForPart(partIndex: number, fallback: string): string {
		return editedBodies[partIndex] ?? fallback
	}

	let contactForm = $state<ContactFormFields>({
		name: '',
		email: '',
		company: '',
		intent: ''
	})
	// Prefill the form from the latest collect_contact_info output.fields once,
	// when this component first sees a ready-to-render collect part. After that
	// the form is the visitor's to type into — no further auto-overwrites.
	let contactFormInitialized = $state(false)

	$effect(() => {
		if (contactFormInitialized || !showCollectForm) return
		const latestCollect = parts.find(
			(p) => p.type === 'tool-collect_contact_info' && p.state === 'output-available'
		)
		if (!latestCollect || latestCollect.type !== 'tool-collect_contact_info') return
		if (latestCollect.state !== 'output-available') return
		const fields = latestCollect.output.fields
		contactForm = {
			name: fields.name ?? '',
			email: fields.email ?? '',
			company: fields.company ?? '',
			intent: fields.intent ?? ''
		}
		contactFormInitialized = true
	})

	function submitContactForm() {
		const trimmed: ContactFormFields = {
			name: contactForm.name.trim(),
			email: contactForm.email.trim(),
			company: contactForm.company.trim(),
			intent: contactForm.intent.trim()
		}
		if (!trimmed.name || !trimmed.email || !trimmed.company || !trimmed.intent) return
		onSubmitContactForm?.(trimmed)
	}
</script>

<div class="flex {role === 'user' ? 'justify-end' : 'justify-start'}">
	<div
		class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed {role === 'user'
			? 'bg-brand-primary/20 text-surface-100'
			: 'border border-white/[0.06] bg-white/[0.03] text-surface-300'}"
	>
		{#each parts as part, i (i)}
			{#if part.type === 'text'}
				{#each part.text.split('\n') as line, lineIdx (lineIdx)}
					{#if lineIdx > 0}<br />{/if}{line}
				{/each}
			{:else if part.type === 'tool-collect_contact_info'}
				{#if part.state === 'input-streaming' || part.state === 'input-available'}
					<div class="my-1 inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-surface-500">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary"></span>
						Reading contact info...
					</div>
				{:else if part.state === 'output-available'}
					{@const filled = CONTACT_FIELDS.filter((k) => part.output.fields?.[k])}
					<div
						data-testid="collected-fields"
						class="my-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-brand-accent/20 bg-brand-accent/5 px-2.5 py-1.5 text-[11px] text-surface-400"
					>
						<span class="font-medium text-brand-accent">Collected:</span>
						{#each filled as key (key)}
							<span class="rounded bg-white/[0.04] px-1.5 py-0.5 text-surface-300">
								{key}
							</span>
						{/each}
						{#if filled.length === 0}
							<span class="italic text-surface-500">(none yet)</span>
						{/if}
						{#if part.output.ready}
							<span class="ml-auto text-[10px] text-emerald-400">ready</span>
						{:else if part.output.missing.length > 0}
							<span class="ml-auto text-[10px] text-surface-500">
								missing: {part.output.missing.join(', ')}
							</span>
						{/if}
					</div>
					{#if showCollectForm && !part.output.ready}
						<form
							data-testid="contact-form"
							class="my-2 flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-surface-900/40 p-3"
							onsubmit={(e) => {
								e.preventDefault()
								submitContactForm()
							}}
						>
							<label class="flex flex-col gap-1 text-[11px] text-surface-400">
								Name
								<input
									data-testid="contact-name"
									type="text"
									required
									maxlength="100"
									bind:value={contactForm.name}
									class="rounded-md border border-white/[0.08] bg-surface-950/80 px-2.5 py-1.5 text-[12px] text-surface-200 outline-none focus:border-brand-primary/40"
								/>
							</label>
							<label class="flex flex-col gap-1 text-[11px] text-surface-400">
								Email
								<input
									data-testid="contact-email"
									type="email"
									required
									maxlength="100"
									bind:value={contactForm.email}
									class="rounded-md border border-white/[0.08] bg-surface-950/80 px-2.5 py-1.5 text-[12px] text-surface-200 outline-none focus:border-brand-primary/40"
								/>
							</label>
							<label class="flex flex-col gap-1 text-[11px] text-surface-400">
								Company or role
								<input
									data-testid="contact-company"
									type="text"
									required
									maxlength="100"
									bind:value={contactForm.company}
									class="rounded-md border border-white/[0.08] bg-surface-950/80 px-2.5 py-1.5 text-[12px] text-surface-200 outline-none focus:border-brand-primary/40"
								/>
							</label>
							<label class="flex flex-col gap-1 text-[11px] text-surface-400">
								Reason for reaching out
								<textarea
									data-testid="contact-intent"
									required
									rows="3"
									maxlength="500"
									bind:value={contactForm.intent}
									onkeydown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault()
											e.currentTarget.form?.requestSubmit()
										}
									}}
									aria-describedby="contact-intent-hint"
									class="resize-none rounded-md border border-white/[0.08] bg-surface-950/80 px-2.5 py-1.5 text-[12px] text-surface-200 outline-none focus:border-brand-primary/40"
								></textarea>
								<span id="contact-intent-hint" class="text-[10px] text-surface-600">
									Enter to submit · Shift+Enter for new line
								</span>
							</label>
							<div class="flex justify-end">
								<button
									type="submit"
									data-testid="contact-submit"
									class="rounded-md bg-brand-primary px-3 py-1.5 text-[11px] font-medium text-surface-950 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
								>
									Submit
								</button>
							</div>
						</form>
					{/if}
				{:else if part.state === 'output-error'}
					<div class="my-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-400">
						Error reading contact info: {part.errorText}
					</div>
				{/if}
			{:else if part.type === 'tool-draft_email'}
				{#if part.state === 'input-streaming' || part.state === 'input-available'}
					<div class="my-1 inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-surface-500">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary"></span>
						Drafting email...
					</div>
				{:else if part.state === 'output-available'}
					{@const displayedBody = bodyForPart(i, part.output.body)}
					{@const isEditing = editingPart[i] === true}
					<div
						data-testid="email-preview-card"
						class="my-2 overflow-hidden rounded-xl border border-brand-primary/30 bg-surface-900/60"
					>
						<div class="space-y-1.5 border-b border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px]">
							<div class="flex gap-2">
								<span class="w-14 shrink-0 text-surface-500">To</span>
								<span class="text-surface-300">{RECIPIENT_EMAIL}</span>
							</div>
							<div class="flex gap-2">
								<span class="w-14 shrink-0 text-surface-500">Subject</span>
								<span class="text-surface-200">{part.output.subject}</span>
							</div>
						</div>
						{#if isEditing}
							<div class="flex flex-col gap-2 border-b border-white/[0.06] bg-white/[0.02] p-2.5">
								<textarea
									data-testid="email-body-edit"
									rows="10"
									maxlength="4000"
									bind:value={editBuffers[i]}
									class="w-full resize-y rounded-md border border-white/[0.08] bg-surface-950/80 px-2.5 py-1.5 text-[12px] leading-relaxed text-surface-200 outline-none focus:border-brand-primary/40"
								></textarea>
								<div class="flex justify-end gap-2">
									<button
										type="button"
										data-testid="email-edit-discard"
										onclick={() => discardEdit(i)}
										class="rounded-md px-2.5 py-1 text-[11px] text-surface-400 hover:bg-white/[0.04]"
									>
										Discard
									</button>
									<button
										type="button"
										data-testid="email-edit-save"
										onclick={() => saveEdit(i)}
										disabled={!(editBuffers[i] ?? '').trim()}
										class="rounded-md bg-brand-primary px-2.5 py-1 text-[11px] font-medium text-surface-950 disabled:opacity-30"
									>
										Save
									</button>
								</div>
							</div>
						{:else}
							<div class="px-3 py-2.5 text-[12px] whitespace-pre-wrap text-surface-200">
								{displayedBody}
							</div>
						{/if}
						{#if showDraftActions && !isEditing}
							<div class="flex justify-end gap-2 border-t border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
								<button
									type="button"
									data-testid="email-action-cancel"
									onclick={() => onDraftAction?.('cancel')}
									class="rounded-md px-2.5 py-1 text-[11px] text-surface-400 hover:bg-white/[0.04]"
								>
									Cancel
								</button>
								<button
									type="button"
									data-testid="email-action-edit"
									onclick={() => startEdit(i, part.output.body)}
									class="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] text-surface-200 hover:bg-white/[0.04]"
								>
									Edit
								</button>
								<button
									type="button"
									data-testid="email-action-send"
									onclick={() => onDraftAction?.('send', displayedBody)}
									class="rounded-md bg-brand-primary px-2.5 py-1 text-[11px] font-medium text-surface-950 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
								>
									Send
								</button>
							</div>
						{/if}
					</div>
				{:else if part.state === 'output-error'}
					<div class="my-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-400">
						Drafting failed: {part.errorText}
					</div>
				{/if}
			{:else if part.type === 'tool-send_email'}
				{@const stageMap = new Map(
					parts
						.filter((p) => p.type === 'data-email-stage')
						.map((p) => [p.data.stageName, p.data])
				)}
				<div
					data-testid="email-stage-list"
					class="my-2 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
				>
					{#each SEND_STAGE_ORDER as stageName (stageName)}
						{@const stage = stageMap.get(stageName)}
						{@const status = stage?.status ?? 'pending'}
						<div class="flex items-center gap-3 text-[11px]">
							<span class="text-surface-300">{SEND_STAGE_LABELS[stageName]}</span>
							<span class="ml-auto rounded-md px-2 py-0.5 font-mono text-[10px] {STATUS_STYLES[status]}">
								{status}
							</span>
							{#if status === 'failed' && stage?.detail}
								<span class="text-[10px] text-red-300/80">{stage.detail}</span>
							{/if}
						</div>
					{/each}
				</div>
				{#if part.state === 'output-available' && !part.output.ok}
					<div class="my-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-400">
						{part.output.message}
					</div>
				{:else if part.state === 'output-error'}
					<div class="my-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-400">
						Send failed: {part.errorText}
					</div>
				{/if}
			{/if}
		{/each}

		{#if role === 'assistant' && metadata}
			<!-- Confidence badge + source chips row -->
			<div class="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2.5">
				<!-- Confidence badge -->
				<span class="flex items-center gap-1.5 text-[10px] {confidenceTextColors[metadata.confidence]}">
					<span class="inline-block h-1.5 w-1.5 rounded-full {confidenceColors[metadata.confidence]}"
					></span>
					{metadata.confidence} confidence
				</span>

				<!-- Source chips -->
				{#each metadata.sources as category (category)}
					{@const sectionId = SECTION_MAP[category]}
					{#if sectionId}
						<button
							class="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-medium text-brand-accent transition-colors hover:bg-brand-accent/25"
							onclick={() => handleSourceClick(category)}
						>
							{CATEGORY_LABELS[category]}
						</button>
					{:else}
						<span
							class="rounded-full bg-brand-accent/10 px-2 py-0.5 text-[10px] font-medium text-brand-accent/70"
						>
							{CATEGORY_LABELS[category]}
						</span>
					{/if}
				{/each}
			</div>

			<!-- Follow-up suggestions only on the most recent assistant message while chat is idle -->
			{#if showFollowUps && metadata.suggestedFollowUps && metadata.suggestedFollowUps.length > 0}
				<div class="mt-2 flex flex-col gap-1.5">
					{#each metadata.suggestedFollowUps as question (question)}
						<button
							class="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-left text-[11px] text-surface-400 transition-all duration-200 hover:border-brand-primary/30 hover:text-surface-300"
							onclick={() => onSuggestionClick?.(question)}
						>
							{question}
						</button>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
