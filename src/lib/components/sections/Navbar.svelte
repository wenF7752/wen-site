<script lang="ts">
	import Button from '../ui/Button.svelte';

	let isMenuOpen = $state(false);

	const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<nav class="glass-nav">
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
		<a href="/" class="text-2xl font-bold tracking-tight text-brand-primary">
			WEN<span class="text-brand-accent">.</span>
		</a>

		<!-- Desktop Nav -->
		<div class="hidden items-center gap-8 md:flex">
			<a
				href="#projects"
				class="font-medium text-surface-600 transition-colors hover:text-brand-primary">Projects</a
			>
			<a
				href="#skills"
				class="font-medium text-surface-600 transition-colors hover:text-brand-primary">Skills</a
			>
			<Button variant="outline" href="#contact">Contact</Button>
		</div>

		<!-- Mobile Toggle -->
		<button class="p-2 text-surface-600 md:hidden" onclick={toggleMenu} aria-label="Toggle Menu">
			{#if isMenuOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-menu"
					><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
						x1="4"
						x2="20"
						y1="18"
						y2="18"
					/></svg
				>
			{/if}
		</button>
	</div>

	<!-- Mobile Menu Overlay -->
	{#if isMenuOpen}
		<div class="fixed inset-0 top-20 z-40 flex flex-col gap-6 bg-white p-8 md:hidden">
			<a href="#projects" class="text-2xl font-bold text-surface-900" onclick={toggleMenu}
				>Projects</a
			>
			<a href="#skills" class="text-2xl font-bold text-surface-900" onclick={toggleMenu}>Skills</a>
			<Button variant="primary" href="#contact" class="w-full py-4 text-xl" onclick={toggleMenu}
				>Contact</Button
			>
		</div>
	{/if}
</nav>
