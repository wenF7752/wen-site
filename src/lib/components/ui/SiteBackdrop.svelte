<script lang="ts">
	import NeuralNetCanvas from './NeuralNetCanvas.svelte';
</script>

<!--
	The .site-backdrop gradient is the deliberate visual fallback when
	NeuralNetCanvas fails to mount (e.g. 2D context acquisition fails). If
	the canvas never renders, the radial + linear gradient underneath still
	provides the intended backdrop look.
-->
<div class="site-backdrop pointer-events-none fixed inset-0 z-0" aria-hidden="true">
	<div class="bg-layer absolute inset-0">
		<NeuralNetCanvas />
	</div>
	<div class="vignette absolute inset-0"></div>
	<div class="grain absolute inset-0"></div>
</div>

<style>
	.site-backdrop {
		background:
			radial-gradient(
				ellipse 80% 60% at 15% 40%,
				color-mix(in srgb, var(--color-brand-primary) 10%, transparent),
				transparent 60%
			),
			radial-gradient(
				ellipse 60% 50% at 85% 60%,
				color-mix(in srgb, var(--color-brand-accent) 8%, transparent),
				transparent 60%
			),
			linear-gradient(
				180deg,
				var(--color-surface-950) 0%,
				var(--color-surface-900) 60%,
				var(--color-surface-950) 100%
			);
	}

	.bg-layer {
		opacity: 0.85;
		mask-image: radial-gradient(
			ellipse 100% 100% at 50% 50%,
			var(--color-surface-950) 50%,
			color-mix(in srgb, var(--color-surface-950) 50%, transparent) 100%
		);
	}

	.vignette {
		background:
			radial-gradient(
				ellipse 80% 60% at 50% 50%,
				transparent 40%,
				color-mix(in srgb, var(--color-surface-950) 70%, transparent) 100%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--color-surface-950) 60%, transparent) 0%,
				transparent 15%,
				transparent 85%,
				color-mix(in srgb, var(--color-surface-950) 90%, transparent) 100%
			);
	}

	.grain {
		opacity: 0.04;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
	}
</style>
