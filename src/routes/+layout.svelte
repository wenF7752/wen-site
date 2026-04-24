<script lang="ts">
	import '../app.css';
	import SiteBackdrop from '$lib/components/ui/SiteBackdrop.svelte';
	import Navbar from '$lib/components/sections/Navbar.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
	import ChatWidget from '$lib/components/ui/ChatWidget.svelte';

	let { children } = $props();
</script>

<SiteBackdrop />

<div class="relative z-10 flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>

<ChatWidget />
