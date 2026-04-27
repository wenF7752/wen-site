<script lang="ts">
	import type { Project } from '$lib/data/projects';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

	function openLive() {
		if (!project.liveUrl) return
		window.open(project.liveUrl, '_blank', 'noopener,noreferrer')
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!project.liveUrl) return
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			openLive()
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="card group flex h-full flex-col overflow-hidden {project.liveUrl
		? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
		: ''}"
	role={project.liveUrl ? 'link' : undefined}
	tabindex={project.liveUrl ? 0 : undefined}
	aria-label={project.liveUrl ? `Open ${project.title} live site in a new tab` : undefined}
	onclick={project.liveUrl ? openLive : undefined}
	onkeydown={project.liveUrl ? handleKeydown : undefined}
>
	{#if project.previewImage}
		<div class="relative h-48 overflow-hidden border-b border-white/[0.06] bg-white/[0.02]">
			<img
				src={project.previewImage}
				alt="{project.title} preview"
				loading="lazy"
				class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
			/>
			{#if project.status}
				<span
					class="absolute top-3 left-3 rounded-full px-3 py-0.5 text-xs font-medium backdrop-blur-sm {project.status ===
					'live'
						? 'border border-brand-primary/40 bg-brand-primary/20 text-brand-primary'
						: project.status === 'in-progress'
							? 'border border-brand-accent/40 bg-brand-accent/20 text-brand-accent'
							: 'border border-surface-700 bg-surface-800/80 text-surface-300'}"
				>
					{project.status === 'in-progress' ? 'In Progress' : project.status}
				</span>
			{/if}
		</div>
	{:else}
		<div
			class="flex h-48 items-center justify-center border-b border-white/[0.06] bg-white/[0.02] p-8"
		>
			<div class="flex flex-col items-center gap-3">
				{#if project.status}
					<span
						class="rounded-full px-3 py-0.5 text-xs font-medium {project.status === 'live'
							? 'border border-brand-primary/20 bg-brand-primary/10 text-brand-primary'
							: project.status === 'in-progress'
								? 'border border-brand-accent/20 bg-brand-accent/10 text-brand-accent'
								: 'border border-surface-700 bg-surface-800 text-surface-400'}"
					>
						{project.status === 'in-progress' ? 'In Progress' : project.status}
					</span>
				{/if}
				<div
					class="font-mono text-xl tracking-widest text-surface-600 uppercase transition-colors duration-300 group-hover:text-surface-400"
				>
					{project.title}
				</div>
			</div>
		</div>
	{/if}

	<div class="flex flex-grow flex-col p-6">
		<h3 class="mb-2 text-xl">{project.title}</h3>
		<p class="mb-3 flex-grow text-sm text-surface-400">
			{project.description}
		</p>

		{#if project.aiHighlight}
			<p class="mb-4 text-xs font-medium text-brand-accent italic">
				{project.aiHighlight}
			</p>
		{/if}

		<div class="mb-6 flex flex-wrap gap-2">
			{#each project.tags as tag (tag)}
				<span
					class="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs font-medium text-surface-400"
				>
					{tag}
				</span>
			{/each}
		</div>

		<div class="mt-auto flex items-center gap-4">
			{#if project.link !== '#'}
				<a
					href={project.link}
					target="_blank"
					rel="noopener noreferrer"
					onclick={(e) => e.stopPropagation()}
					class="text-sm font-semibold text-brand-accent transition-colors hover:text-brand-primary"
					>View Code</a
				>
			{/if}
		</div>
	</div>
</div>
