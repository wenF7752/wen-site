<script lang="ts">
	import Button from '../ui/Button.svelte';
</script>

<section class="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
	<!-- Abstract background element -->
	<div class="absolute top-0 right-0 -z-10 opacity-5">
		<svg
			width="600"
			height="600"
			viewBox="0 0 600 600"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="300" cy="300" r="250" stroke="currentColor" stroke-width="2" />
			<path d="M50 300L550 300" stroke="currentColor" stroke-width="1" />
			<path d="M300 50L300 550" stroke="currentColor" stroke-width="1" />
		</svg>
	</div>

	<div class="mx-auto max-w-7xl px-6">
		<div class="max-w-3xl">
			<h1 class="animate-in fade-in slide-in-from-bottom-4 mb-6 leading-[1.1] duration-700">
				Building Digital Systems & <span class="text-brand-primary">Trading The Markets.</span>
			</h1>
			<p
				class="animate-in fade-in slide-in-from-bottom-6 mb-10 max-w-2xl text-lg leading-relaxed text-surface-500 delay-100 duration-700 md:text-xl"
			>
				Senior Software Engineer focused on building robust automated systems, bridging the gap
				between code logic and market discipline.
			</p>
			<div
				class="animate-in fade-in slide-in-from-bottom-8 flex flex-col gap-4 delay-200 duration-700 sm:flex-row"
			>
				<Button variant="primary" href="#projects">View Projects</Button>
				<Button variant="outline" href="#skills">View Skills</Button>
			</div>
		</div>
	</div>
</section>

<style>
	/* Basic Tailwind-like animations if not using a plugin */
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes slide-in-bottom {
		from {
			transform: translateY(1.5rem);
		}
		to {
			transform: translateY(0);
		}
	}

	.animate-in {
		animation:
			fade-in 0.7s ease-out forwards,
			slide-in-bottom 0.7s ease-out forwards;
	}
	.delay-100 {
		animation-delay: 100ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}
</style>
