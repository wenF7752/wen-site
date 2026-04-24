<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import AIWorkflow from '$lib/components/sections/AIWorkflow.svelte';
	import ProjectGrid from '$lib/components/sections/ProjectGrid.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
</script>

<svelte:head>
	<title>Wen | AI-Native Software Engineer</title>
	<meta
		name="description"
		content="Full-Stack Developer building production systems with AI-assisted workflows."
	/>
</svelte:head>

<Hero />
<AIWorkflow />
<ProjectGrid />
<Experience />
