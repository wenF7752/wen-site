<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/sections/Navbar.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import ChatWidget from '$lib/components/ui/ChatWidget.svelte';

	let { children } = $props();
</script>

<!-- Background layers -->
<div class="gradient-mesh" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>

<div class="relative z-10 flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>

<ChatWidget />
