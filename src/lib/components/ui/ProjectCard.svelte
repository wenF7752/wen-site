<script lang="ts">
    import Card from './ui/Card.svelte';
    import type { Project } from '$lib/data/projects';

    interface Props {
        project: Project;
    }

    let { project }: Props = $props();
</script>

<Card class="flex flex-col h-full overflow-hidden">
    <div class="h-48 bg-surface-100 flex items-center justify-center p-8 border-b border-surface-200">
        <!-- Placeholder for project image/logo -->
        <div class="text-surface-300 font-mono text-xl uppercase tracking-widest">{project.title}</div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl mb-2">{project.title}</h3>
        <p class="text-surface-500 text-sm mb-6 flex-grow">{project.description}</p>
        
        <div class="flex flex-wrap gap-2 mb-6">
            {#each project.tags as tag}
                <span class="px-2 py-1 bg-surface-100 text-surface-600 text-xs font-medium rounded-md border border-surface-200">
                    {tag}
                </span>
            {/each}
        </div>
        
        <div class="flex items-center gap-4 mt-auto">
            <a href={project.link} class="text-brand-accent font-semibold text-sm hover:underline">View Code</a>
            <a href={project.link} class="text-brand-accent font-semibold text-sm hover:underline">Live Demo</a>
        </div>
    </div>
</Card>
