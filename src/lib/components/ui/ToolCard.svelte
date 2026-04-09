<script lang="ts">
	import Card from './Card.svelte';
	import type { AISkillCard } from '$lib/data/ai-workflow';

	interface Props {
		skill: AISkillCard;
	}

	let { skill }: Props = $props();

	const borderColors = {
		orchestration: 'border-l-brand-accent',
		engineering: 'border-l-brand-primary',
		quality: 'border-l-surface-500'
	};

	const badgeColors = {
		orchestration: 'border-brand-accent/20 bg-brand-accent/10 text-brand-accent',
		engineering: 'border-brand-primary/20 bg-brand-primary/10 text-brand-primary',
		quality: 'border-surface-600 bg-surface-800 text-surface-400'
	};
</script>

<Card class="flex h-full flex-col border-l-4 {borderColors[skill.category]} p-6">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-bold text-surface-50" style="font-size: 1.125rem;">{skill.name}</h3>
		<span class="rounded-full border px-2 py-0.5 text-xs font-medium {badgeColors[skill.category]}">
			{skill.category}
		</span>
	</div>

	<p class="mb-5 text-sm leading-relaxed text-surface-400">{skill.role}</p>

	<ul class="mt-auto space-y-2">
		{#each skill.details as detail (detail)}
			<li class="flex items-start gap-2.5 text-xs text-surface-500">
				<span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary/60"></span>
				{detail}
			</li>
		{/each}
	</ul>
</Card>
