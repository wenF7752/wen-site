<script lang="ts">
	import Button from '../ui/Button.svelte';

	let heroRef: HTMLElement | undefined = $state();
	let mouseX = $state(0);
	let mouseY = $state(0);
	let scrollY = $state(0);
	let mounted = $state(false);
	let hasInteracted = $state(false);

	const line1 = 'Engineering with AI.';
	const line2 = 'Shipping with Precision.';
	const chars1 = line1.split('');
	const chars2 = line2.split('');

	// Random micro-rotations for entrance
	const rotations1 = chars1.map(() => (Math.random() - 0.5) * 6);
	const rotations2 = chars2.map(() => (Math.random() - 0.5) * 6);

	function handleMouseMove(e: MouseEvent) {
		if (!heroRef) return;
		hasInteracted = true;
		const rect = heroRef.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
	}

	function handleScroll() {
		scrollY = window.scrollY;
	}

	$effect(() => {
		mounted = true;
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function charStyle(
		el: HTMLSpanElement | null,
		_mouseX: number,
		_mouseY: number,
		_hasInteracted: boolean
	): string {
		if (!el || !_hasInteracted) return '';
		const rect = el.getBoundingClientRect();
		const heroRect = heroRef?.getBoundingClientRect();
		if (!heroRect) return '';

		const charCenterX = rect.left - heroRect.left + rect.width / 2;
		const charCenterY = rect.top - heroRect.top + rect.height / 2;
		const dx = _mouseX - charCenterX;
		const dy = _mouseY - charCenterY;
		const dist = Math.sqrt(dx * dx + dy * dy);

		const maxDist = 300;
		const proximity = Math.max(0, 1 - dist / maxDist);

		// Weight shifts from 700 toward 300 near cursor
		const weight = Math.round(700 - proximity * 400);
		// Wonk axis increases near cursor
		const wonk = (proximity * 0.8).toFixed(2);
		// Subtle push away from cursor
		const pushX = dist > 10 ? (-dx / dist) * proximity * 4 : 0;
		const pushY = dist > 10 ? (-dy / dist) * proximity * 3 : 0;

		return `font-variation-settings: 'wght' ${weight}, 'WONK' ${wonk}, 'opsz' 144; transform: translate(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px);`;
	}
</script>

<section
	bind:this={heroRef}
	class="relative overflow-hidden pt-28 pb-20 md:pt-44 md:pb-32"
	onmousemove={handleMouseMove}
	role="banner"
>
	<!-- Aurora gradient blobs -->
	<div
		class="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-primary/15 blur-[140px]"
		style="transform: translateY({scrollY * 0.15}px);"
	></div>
	<div
		class="pointer-events-none absolute -top-20 -right-20 h-[600px] w-[600px] rounded-full bg-brand-accent/10 blur-[140px]"
		style="transform: translateY({scrollY * 0.1}px);"
	></div>
	<div
		class="pointer-events-none absolute top-60 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-warm/5 blur-[100px]"
		style="transform: translateY({scrollY * 0.2}px);"
	></div>

	<div
		class="relative z-10 mx-auto max-w-7xl px-6"
		style="transform: translateY({scrollY * -0.08}px);"
	>
		<div class="max-w-5xl">
			<!-- Role tag -->
			<div
				class="hero-tag mb-6 font-mono text-sm tracking-wider text-brand-primary"
				class:visible={mounted}
			>
				Senior Software Engineer
			</div>

			<!-- Kinetic headline line 1 -->
			<h1 class="hero-headline mb-2" aria-label={line1}>
				{#each chars1 as char, i}
					<span
						class="kinetic-char"
						class:visible={mounted}
						style="--delay: {i * 30}ms; --rotate: {rotations1[i]}deg; {charStyle(null, mouseX, mouseY, false)}"
						aria-hidden="true"
					>{char === ' ' ? '\u00A0' : char}</span>
				{/each}
			</h1>

			<!-- Headline line 2 (gradient) -->
			<h1 class="hero-line2 text-gradient mb-10" class:visible={mounted}>
				{line2}
			</h1>

			<!-- Subtext -->
			<p
				class="hero-sub mb-14 max-w-2xl text-lg leading-relaxed text-surface-400 md:text-xl"
				class:visible={mounted}
			>
				Building production systems with AI-assisted workflows. The right tool for each phase.
				Human judgment at every checkpoint.
			</p>

			<!-- CTAs -->
			<div class="hero-cta flex flex-col gap-4 sm:flex-row" class:visible={mounted}>
				<Button variant="primary" href="#ai-workflow">View Pipeline</Button>
				<Button variant="outline" href="#projects">View Projects</Button>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-tag {
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}
	.hero-tag.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-headline {
		display: flex;
		flex-wrap: wrap;
		font-family: 'Fraunces', serif;
		font-variation-settings: 'wght' 700, 'WONK' 0, 'opsz' 144;
		line-height: 1.05;
	}

	.kinetic-char {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.6em) rotate(var(--rotate, 2deg));
		font-variation-settings: 'wght' 100, 'WONK' 1, 'opsz' 144;
		transition: font-variation-settings 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform, font-variation-settings;
	}

	.kinetic-char.visible {
		animation: char-arrive 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: var(--delay, 0ms);
	}

	@keyframes char-arrive {
		from {
			opacity: 0;
			transform: translateY(0.6em) rotate(var(--rotate, 2deg));
			font-variation-settings: 'wght' 100, 'WONK' 1, 'opsz' 144;
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
			font-variation-settings: 'wght' 700, 'WONK' 0, 'opsz' 144;
		}
	}

	/* Cursor proximity weight shift (desktop only) */
	@media (hover: hover) {
		.kinetic-char:hover {
			font-variation-settings: 'wght' 300, 'WONK' 0.8, 'opsz' 144;
			transform: scale(1.05);
			color: var(--color-brand-primary);
			transition-duration: 0.15s;
		}
	}

	.hero-line2 {
		font-family: 'Fraunces', serif;
		font-variation-settings: 'wght' 700, 'WONK' 0, 'opsz' 144;
		line-height: 1.15;
		padding-bottom: 0.05em;
		opacity: 0;
		transform: translateY(1rem);
		transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s;
	}
	.hero-line2.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-sub {
		opacity: 0;
		transform: translateY(1.5rem);
		transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
	}
	.hero-sub.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-cta {
		opacity: 0;
		transform: translateY(1.5rem);
		transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s;
	}
	.hero-cta.visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
