<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import AIWorkflow from '$lib/components/sections/AIWorkflow.svelte';
	import ProjectGrid from '$lib/components/sections/ProjectGrid.svelte';
	import Experience from '$lib/components/sections/Experience.svelte';
	import { homepageJsonLd } from '$lib/seo/jsonld';
</script>

<svelte:head>
	<title>Wen Fang | AI-Native Fullstack Developer (Phoenix)</title>
	<meta
		name="description"
		content="Wen Fang is an AI-native fullstack developer in Phoenix, AZ. He builds production web systems with agentic AI workflows. See projects and contact."
	/>
	<meta name="author" content="Wen Fang" />
	<link rel="canonical" href="https://wenfang.dev/" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Wen Fang" />
	<meta property="og:url" content="https://wenfang.dev/" />
	<meta property="og:title" content="Wen Fang | AI-Native Fullstack Developer (Phoenix)" />
	<meta
		property="og:description"
		content="Wen Fang is an AI-native fullstack developer in Phoenix, AZ. He builds production web systems with agentic AI workflows."
	/>
	<meta property="og:image" content="https://wenfang.dev/og-image.svg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Wen Fang — AI-Native Fullstack Developer" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@WenTradeFuture" />
	<meta name="twitter:creator" content="@WenTradeFuture" />
	<meta name="twitter:title" content="Wen Fang | AI-Native Fullstack Developer (Phoenix)" />
	<meta
		name="twitter:description"
		content="AI-native fullstack developer in Phoenix, AZ. Builds production web systems with agentic AI workflows."
	/>
	<meta name="twitter:image" content="https://wenfang.dev/og-image.svg" />

	<!-- JSON-LD is a pre-stringified static graph from $lib/seo/jsonld; never user input. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${homepageJsonLd}</` + `script>`}
</svelte:head>

<Hero />
<AIWorkflow />
<ProjectGrid />
<Experience />
