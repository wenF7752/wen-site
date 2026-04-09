<script lang="ts">
	import Button from '../ui/Button.svelte';
</script>

<section class="relative overflow-hidden pt-24 pb-32 md:pt-40 md:pb-56">
	<!-- Aurora gradient blobs -->
	<div
		class="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-primary/15 blur-[140px]"
	></div>
	<div
		class="pointer-events-none absolute -top-20 -right-20 h-[600px] w-[600px] rounded-full bg-brand-accent/10 blur-[140px]"
	></div>
	<div
		class="pointer-events-none absolute top-60 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-primary/5 blur-[100px]"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6">
		<div class="max-w-4xl">
			<div class="animate-in mb-3 font-mono text-sm tracking-wider text-brand-primary">
				Senior Software Engineer
			</div>

			<h1 class="animate-in mb-8 font-extrabold delay-75">
				Engineering with AI.<br />
				<span class="text-gradient">Shipping with Precision.</span>
			</h1>

			<p
				class="animate-in mb-12 max-w-2xl text-lg leading-relaxed text-surface-400 delay-150 md:text-xl"
			>
				Building production systems with AI-assisted workflows. The right tool for each phase.
				Human judgment at every checkpoint.
			</p>

			<div class="animate-in flex flex-col gap-4 delay-200 sm:flex-row">
				<Button variant="primary" href="#ai-workflow">View AI Workflow</Button>
				<Button variant="outline" href="#projects">View Projects</Button>
			</div>
		</div>
	</div>
</section>

<style>
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

	.animate-in {
		animation:
			fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
			slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}
	.delay-75 {
		animation-delay: 75ms;
	}
	.delay-150 {
		animation-delay: 150ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}
</style>
