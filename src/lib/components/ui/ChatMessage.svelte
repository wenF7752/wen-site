<script lang="ts">
	import {
		CATEGORY_LABELS,
		SECTION_MAP,
		type ChatMessageMetadata,
		type ContentCategory
	} from '$lib/types/chat'

	interface Props {
		role: 'user' | 'assistant'
		content: string
		metadata?: ChatMessageMetadata
		onSourceClick?: (sectionId: string) => void
		onSuggestionClick?: (text: string) => void
	}

	let { role, content, metadata, onSourceClick, onSuggestionClick }: Props = $props()

	const confidenceColors: Record<string, string> = {
		high: 'bg-emerald-500',
		medium: 'bg-yellow-500',
		low: 'bg-red-500'
	}

	const confidenceTextColors: Record<string, string> = {
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
</script>

<div class="flex {role === 'user' ? 'justify-end' : 'justify-start'}">
	<div
		class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed {role === 'user'
			? 'bg-brand-primary/20 text-surface-100'
			: 'border border-white/[0.06] bg-white/[0.03] text-surface-300'}"
	>
		{#each content.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
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

			<!-- Follow-up suggestions -->
			{#if metadata.suggestedFollowUps && metadata.suggestedFollowUps.length > 0}
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
