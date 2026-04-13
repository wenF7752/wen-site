<script lang="ts">
	import ProjectCard from '../ui/ProjectCard.svelte';
	import { projects } from '$lib/data/projects';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="projects" class="py-24 md:py-32">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16" use:reveal>
			<h2 class="mb-4">Selected Projects</h2>
			<p class="max-w-2xl text-surface-400">
				A collection of tools and platforms built to solve real-world problems in automation, AI,
				and software engineering.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project, i (project.title)}
				<div class="h-full" use:reveal={{ delay: i * 100 }}>
					<ProjectCard {project} />
				</div>
			{/each}
		</div>
	</div>
</section>
