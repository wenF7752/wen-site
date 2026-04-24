<script lang="ts">
	import Button from '../ui/Button.svelte';

	let isMenuOpen = $state(false);

	const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<nav class="glass-nav">
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-14">
		<a href="/" class="text-lg font-extrabold tracking-tight text-surface-50">
			WEN<span class="text-brand-primary">.</span>
		</a>

		<!-- Desktop Nav -->
		<div class="hidden items-center gap-2 md:flex">
			<a
				href="#ai-workflow"
				class="rounded-lg px-3.5 py-2 text-sm font-medium text-fg-secondary transition-colors hover:bg-white/[0.03] hover:text-surface-50"
				>AI Workflow</a
			>
			<a
				href="#projects"
				class="rounded-lg px-3.5 py-2 text-sm font-medium text-fg-secondary transition-colors hover:bg-white/[0.03] hover:text-surface-50"
				>Projects</a
			>
			<Button variant="outline" href="#contact">Contact</Button>
		</div>

		<!-- Mobile Toggle -->
		<button class="p-2 text-surface-400 md:hidden" onclick={toggleMenu} aria-label="Toggle Menu">
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
					stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
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
		<div
			class="fixed inset-0 top-20 z-40 flex flex-col gap-6 border-t border-white/5 bg-surface-950/95 p-8 backdrop-blur-xl md:hidden"
		>
			<a href="#ai-workflow" class="text-2xl font-bold text-surface-50" onclick={toggleMenu}
				>AI Workflow</a
			>
			<a href="#projects" class="text-2xl font-bold text-surface-50" onclick={toggleMenu}
				>Projects</a
			>
			<Button variant="primary" href="#contact" class="w-full py-4 text-xl" onclick={toggleMenu}
				>Contact</Button
			>
		</div>
	{/if}
</nav>
