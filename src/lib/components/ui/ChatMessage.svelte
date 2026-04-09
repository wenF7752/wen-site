<script lang="ts">
	interface Props {
		role: 'user' | 'assistant';
		content: string;
	}

	let { role, content }: Props = $props();
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
	</div>
</div>
