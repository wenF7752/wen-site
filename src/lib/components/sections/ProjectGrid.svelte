<script lang="ts">
	import ProjectCard from '../ui/ProjectCard.svelte';
	import { projects } from '$lib/data/projects';
</script>

<section id="projects" class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16">
			<h2 class="mb-4">Selected Projects</h2>
			<p class="max-w-2xl text-surface-500">
				A collection of tools and platforms built to solve real-world problems in automation, AI,
				and financial technology.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project (project.title)}
				<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>
