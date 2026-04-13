<script lang="ts">
	import Card from './Card.svelte';
	import type { Project } from '$lib/data/projects';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
	let isHovered = $state(false);

	const statusConfig: Record<string, { color: string; rgb: string; label: string }> = {
		live: { color: 'var(--color-brand-primary)', rgb: '16, 185, 129', label: 'Live' },
		'in-progress': { color: 'var(--color-brand-accent)', rgb: '59, 130, 246', label: 'In Progress' },
		archived: { color: 'var(--color-surface-500)', rgb: '100, 116, 139', label: 'Archived' }
	};

	const config = $derived(project.status ? statusConfig[project.status] : null);
</script>

<div
	class="h-full"
	role="article"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<Card class="project-card group flex h-full flex-col overflow-hidden">
		<!-- Preview area with mesh gradient -->
		<div class="relative flex h-44 items-center justify-center overflow-hidden p-8">
			<!-- Animated mesh background -->
			<div
				class="absolute inset-0 transition-all duration-700"
				style="background:
					radial-gradient(ellipse 80% 80% at 20% 30%, rgba({config?.rgb ?? '100,116,139'}, 0.08) 0%, transparent 60%),
					radial-gradient(ellipse 60% 60% at 80% 70%, rgba({config?.rgb ?? '100,116,139'}, 0.05) 0%, transparent 60%);
					{isHovered ? `background:
					radial-gradient(ellipse 80% 80% at 30% 40%, rgba(${config?.rgb ?? '100,116,139'}, 0.14) 0%, transparent 60%),
					radial-gradient(ellipse 60% 60% at 70% 60%, rgba(${config?.rgb ?? '100,116,139'}, 0.08) 0%, transparent 60%);` : ''}"
			></div>
			<!-- Subtle grid pattern -->
			<div
				class="pointer-events-none absolute inset-0 opacity-30"
				style="background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
					linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
					background-size: 24px 24px;"
			></div>
			<!-- Bottom edge fade -->
			<div class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-950/50 to-transparent"></div>

			<div class="relative flex flex-col items-center gap-3">
				{#if config}
					<span
						class="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wider uppercase transition-all duration-300"
						style="border-color: rgba({config.rgb}, 0.25); background: rgba({config.rgb}, 0.1); color: {config.color};"
					>
						{#if project.status === 'live'}
							<span class="relative flex h-1.5 w-1.5">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style="background: {config.color};"></span>
								<span class="relative inline-flex h-1.5 w-1.5 rounded-full" style="background: {config.color};"></span>
							</span>
						{/if}
						{config.label}
					</span>
				{/if}
				<div
					class="font-mono text-lg tracking-[0.2em] text-surface-500 uppercase transition-all duration-500"
					style={isHovered ? 'color: var(--color-surface-300); letter-spacing: 0.3em;' : ''}
				>
					{project.title}
				</div>
			</div>
		</div>

		<!-- Content area -->
		<div class="flex flex-grow flex-col p-6">
			<h3 class="mb-2 text-lg font-bold text-surface-50">{project.title}</h3>
			<p class="mb-3 flex-grow text-[13px] leading-relaxed text-surface-400">
				{project.description}
			</p>

			{#if project.aiHighlight}
				<p
					class="mb-4 border-l-2 pl-3 text-xs leading-relaxed text-brand-accent/80"
					style="border-color: rgba(59, 130, 246, 0.3);"
				>
					{project.aiHighlight}
				</p>
			{/if}

			<div class="mb-5 flex flex-wrap gap-1.5">
				{#each project.tags as tag, i (tag)}
					<span
						class="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-surface-500 transition-all duration-300"
						style={isHovered ? `transform: translateY(-1px); transition-delay: ${i * 30}ms; color: var(--color-surface-400); border-color: rgba(255,255,255,0.1);` : 'transition-delay: 0ms;'}
					>
						{tag}
					</span>
				{/each}
			</div>

			<div class="mt-auto">
				{#if project.link !== '#'}
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						class="group/link inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-semibold text-surface-300 transition-all duration-300 hover:border-brand-primary/30 hover:text-brand-primary"
					>
						View Code
						<span class="inline-block transition-transform duration-200 group-hover/link:translate-x-1">&rarr;</span>
					</a>
				{/if}
			</div>
		</div>
	</Card>
</div>
