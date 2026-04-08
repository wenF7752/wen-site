<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/sections/Navbar.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-grow">
		{@render children()}
	</main>
	<Footer />
</div>
