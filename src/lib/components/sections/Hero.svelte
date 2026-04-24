<script lang="ts">
	import { onMount } from 'svelte';

	let tCounter = $state('00000');

	onMount(() => {
		const t0 = performance.now();
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		let reducedMotion = reducedMotionQuery.matches;
		let intervalId: ReturnType<typeof setInterval> | null = null;

		const tick = () => {
			tCounter = (Math.floor(performance.now() - t0) % 100000).toString().padStart(5, '0');
		};

		const start = () => {
			if (intervalId !== null || reducedMotion || document.hidden) return;
			tick();
			intervalId = setInterval(tick, 100);
		};

		const stop = () => {
			if (intervalId === null) return;
			clearInterval(intervalId);
			intervalId = null;
		};

		const onVisibility = () => (document.hidden ? stop() : start());
		const onReducedMotionChange = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
			if (reducedMotion) stop();
			else start();
		};

		tick();
		start();
		document.addEventListener('visibilitychange', onVisibility);
		reducedMotionQuery.addEventListener('change', onReducedMotionChange);

		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibility);
			reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
		};
	});
</script>

<section class="relative min-h-[calc(100vh-5rem)] overflow-hidden">
	<!-- Foreground content -->
	<div class="relative z-[5] mx-auto max-w-7xl px-6 pt-[110px] pb-[180px] md:px-14">
		<h1
			class="animate-in mb-7 font-extrabold"
			style="font-size: clamp(42px, 6.2vw, 88px); line-height: 1.02; letter-spacing: -0.03em; max-width: 1000px; text-wrap: balance;"
		>
			<span class="block text-surface-50">Engineering with AI.</span>
			<span class="block text-gradient-headline">Shipping with Precision.</span>
		</h1>

		<p
			class="animate-in mb-10 text-fg-secondary delay-150"
			style="font-size: 17px; line-height: 1.55; max-width: 540px; text-wrap: pretty;"
		>
			Building production systems with AI-assisted workflows. The right tool for each phase. Human
			judgment at every checkpoint.
		</p>

		<div class="animate-in flex flex-wrap gap-3 delay-200">
			<a href="#ai-workflow" class="hero-btn hero-btn-primary">View AI Workflow</a>
			<a href="#projects" class="hero-btn hero-btn-ghost">View Projects</a>
		</div>
	</div>

	<!-- Statusbar -->
	<div
		class="absolute right-0 bottom-6 left-0 z-[6] mx-auto flex max-w-7xl flex-col gap-3 px-6 font-mono text-[11px] tracking-[0.12em] text-fg-tertiary md:flex-row md:items-center md:justify-between md:px-14"
	>
		<div
			class="inline-flex items-center gap-2 self-start rounded-md border border-white/[0.08] bg-white/[0.015] px-3 py-1.5"
		>
			<span class="status-dot inline-block h-[5px] w-[5px] rounded-full"></span>
			<span>SYSTEM ONLINE</span>
		</div>
		<div class="flex items-center gap-2.5">
			<span>LAT 33.45° N</span>
			<span class="opacity-30">/</span>
			<span>LON 112.07° W</span>
			<span class="opacity-30">/</span>
			<span class="text-fg-secondary">T+{tCounter}</span>
		</div>
	</div>
</section>

<style>
	.status-dot {
		background: var(--color-brand-primary);
		box-shadow: 0 0 6px var(--color-brand-primary);
		animation: pulse 1.6s ease-in-out infinite;
	}

	/* Hero-local CTA buttons (distinct from the shared Button component) */
	.hero-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 13px 22px;
		border-radius: 10px;
		font-weight: 600;
		font-size: 14px;
		text-decoration: none;
		transition:
			transform 0.15s,
			box-shadow 0.2s,
			background 0.2s,
			border-color 0.2s;
	}
	.hero-btn-primary {
		background: var(--color-brand-primary);
		color: var(--color-surface-950);
		box-shadow:
			0 0 0 1px rgba(16, 185, 129, 0.5),
			0 10px 30px -10px rgba(16, 185, 129, 0.7);
	}
	.hero-btn-primary:hover {
		transform: translateY(-1px);
		box-shadow:
			0 0 0 1px rgba(16, 185, 129, 0.6),
			0 14px 34px -10px rgba(16, 185, 129, 0.9);
	}
	.hero-btn-ghost {
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: var(--color-surface-50);
	}
	.hero-btn-ghost:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.22);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes slide-up {
		from {
			transform: translateY(2rem);
		}
		to {
			transform: translateY(0);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.animate-in {
		animation:
			fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
			slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}
	.delay-150 {
		animation-delay: 150ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}

	@media (prefers-reduced-motion: reduce) {
		.animate-in,
		.status-dot {
			animation: none;
		}
		.animate-in {
			opacity: 1;
		}
	}
</style>
