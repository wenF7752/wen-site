<script lang="ts">
	import NeuralNetCanvas from './NeuralNetCanvas.svelte';
</script>

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
			radial-gradient(ellipse 80% 60% at 15% 40%, rgba(16, 185, 129, 0.1), transparent 60%),
			radial-gradient(ellipse 60% 50% at 85% 60%, rgba(59, 130, 246, 0.08), transparent 60%),
			linear-gradient(180deg, #05070d 0%, #0a0f1c 60%, #05070d 100%);
	}

	.bg-layer {
		opacity: 0.85;
		mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, #000 50%, rgba(0, 0, 0, 0.5) 100%);
	}

	.vignette {
		background:
			radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(5, 7, 13, 0.7) 100%),
			linear-gradient(
				180deg,
				rgba(5, 7, 13, 0.6) 0%,
				transparent 15%,
				transparent 85%,
				rgba(5, 7, 13, 0.9) 100%
			);
	}

	.grain {
		opacity: 0.04;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
	}
</style>
