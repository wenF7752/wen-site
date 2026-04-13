<script lang="ts">
	import Button from '../ui/Button.svelte';

	let isMenuOpen = $state(false);
	let scrolled = $state(false);

	const toggleMenu = () => (isMenuOpen = !isMenuOpen);

	$effect(() => {
		function handleScroll() {
			scrolled = window.scrollY > 20;
		}
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav class="glass-nav transition-all duration-300" class:scrolled>
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
		<a href="/" class="group text-2xl font-bold tracking-tight text-surface-50">
			WEN<span class="text-brand-primary transition-transform duration-300 inline-block group-hover:rotate-12 group-hover:scale-125">.</span>
		</a>

		<!-- Desktop Nav -->
		<div class="hidden items-center gap-8 md:flex">
			<a href="#ai-workflow" class="nav-link">Pipeline</a>
			<a href="#projects" class="nav-link">Projects</a>
			<Button variant="outline" href="#contact">Contact</Button>
		</div>

		<!-- Mobile Toggle -->
		<button
			class="relative p-2 text-surface-400 transition-colors hover:text-surface-50 md:hidden"
			onclick={toggleMenu}
			aria-label="Toggle Menu"
		>
			<div class="hamburger" class:open={isMenuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>
	</div>

	<!-- Mobile Menu Overlay -->
	{#if isMenuOpen}
		<div
			class="mobile-menu fixed inset-0 top-20 z-40 flex flex-col gap-6 border-t border-white/5 bg-surface-950/95 p-8 backdrop-blur-xl md:hidden"
		>
			<a href="#ai-workflow" class="mobile-link" onclick={toggleMenu} style="--i: 0;">
				Pipeline
			</a>
			<a href="#projects" class="mobile-link" onclick={toggleMenu} style="--i: 1;">
				Projects
			</a>
			<div class="mobile-link" style="--i: 2;">
				<Button variant="primary" href="#contact" class="w-full py-4 text-xl" onclick={toggleMenu}>
					Contact
				</Button>
			</div>
		</div>
	{/if}
</nav>

<style>
	.scrolled {
		border-bottom-color: rgba(255, 255, 255, 0.08);
		background: rgba(3, 7, 18, 0.9);
	}

	/* Animated hamburger */
	.hamburger {
		width: 24px;
		height: 18px;
		position: relative;
	}
	.hamburger span {
		display: block;
		position: absolute;
		height: 2px;
		width: 100%;
		background: currentColor;
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hamburger span:nth-child(1) { top: 0; }
	.hamburger span:nth-child(2) { top: 8px; }
	.hamburger span:nth-child(3) { top: 16px; }

	.hamburger.open span:nth-child(1) {
		top: 8px;
		transform: rotate(45deg);
	}
	.hamburger.open span:nth-child(2) {
		opacity: 0;
		transform: translateX(8px);
	}
	.hamburger.open span:nth-child(3) {
		top: 8px;
		transform: rotate(-45deg);
	}

	/* Mobile menu items stagger in */
	.mobile-link {
		opacity: 0;
		transform: translateX(-1rem);
		animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(var(--i, 0) * 80ms + 100ms);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-surface-50);
	}

	@keyframes slide-in {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
