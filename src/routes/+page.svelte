<script lang="ts">
    import Hero from '$lib/components/Hero.svelte';
    import Projects from '$lib/components/Projects.svelte';
    import Skills from '$lib/components/Skills.svelte';
</script>

<svelte:head>
	<title>Wen | Senior Software Engineer</title>
	<meta name="description" content="Wen's personal portfolio site" />
</svelte:head>

<main>
    <Hero />
    <Projects />
    <Skills />
</main>

<style>
    main {
        min-height: 100vh;
    }
</style>
