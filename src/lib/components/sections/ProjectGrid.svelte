<script lang="ts">
    import ProjectCard from './ui/ProjectCard.svelte';
    import { projects } from '$lib/data/projects';
</script>

<section id="projects" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6">
        <div class="mb-16">
            <h2 class="mb-4">Selected Projects</h2>
            <p class="text-surface-500 max-w-2xl">
                A collection of tools and platforms built to solve real-world problems 
                in automation, AI, and financial technology.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each projects as project}
                <ProjectCard {project} />
            {/each}
        </div>
    </div>
</section>
