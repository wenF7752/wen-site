<script lang="ts">
	import Card from './Card.svelte';
	import type { Project } from '$lib/data/projects';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<Card class="flex h-full flex-col overflow-hidden">
	<div class="flex h-48 items-center justify-center border-b border-surface-200 bg-surface-100 p-8">
		<!-- Placeholder for project image/logo -->
		<div class="font-mono text-xl tracking-widest text-surface-300 uppercase">
			{project.title}
		</div>
	</div>

	<div class="flex flex-grow flex-col p-6">
		<h3 class="mb-2 text-xl">{project.title}</h3>
		<p class="mb-6 flex-grow text-sm text-surface-500">
			{project.description}
		</p>

		<div class="mb-6 flex flex-wrap gap-2">
			{#each project.tags as tag (tag)}
				<span
					class="rounded-md border border-surface-200 bg-surface-100 px-2 py-1 text-xs font-medium text-surface-600"
				>
					{tag}
				</span>
			{/each}
		</div>

		<div class="mt-auto flex items-center gap-4">
			<a href={project.link} class="text-sm font-semibold text-brand-accent hover:underline"
				>View Code</a
			>
			<a href={project.link} class="text-sm font-semibold text-brand-accent hover:underline"
				>Live Demo</a
			>
		</div>
	</div>
</Card>
