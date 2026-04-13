<script lang="ts">
	import { pipelinePhases } from '$lib/data/ai-workflow';
	import { reveal } from '$lib/actions/reveal';

	let sectionInView = $state(false);
	let phaseRefs: (HTMLElement | undefined)[] = $state(
		Array(pipelinePhases.length).fill(undefined)
	);
	let activePhaseIndex = $state(0);
	let phaseRevealed: boolean[] = $state(Array(pipelinePhases.length).fill(false));

	// Track active phase + section visibility via scroll position
	$effect(() => {
		function onScroll() {
			const refs = phaseRefs.filter((r): r is HTMLElement => r !== undefined);
			if (refs.length === 0) return;

			const viewportCenter = window.innerHeight / 2;
			let closestIdx = 0;
			let closestDist = Infinity;

			for (let i = 0; i < refs.length; i++) {
				const rect = refs[i].getBoundingClientRect();
				const phaseCenter = rect.top + rect.height / 2;
				const dist = Math.abs(phaseCenter - viewportCenter);
				if (dist < closestDist) {
					closestDist = dist;
					closestIdx = i;
				}
			}

			activePhaseIndex = closestIdx;

			// Section is "in view" when at least one phase overlaps the viewport center zone
			// Use a generous zone: the closest phase center must be within 1.2x viewport height
			sectionInView = closestDist < window.innerHeight * 0.8;

			// Mark phases as revealed once they enter viewport
			for (let i = 0; i < refs.length; i++) {
				if (!phaseRevealed[i]) {
					const rect = refs[i].getBoundingClientRect();
					if (rect.top < window.innerHeight * 0.85) {
						phaseRevealed[i] = true;
					}
				}
			}
		}

		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<section id="ai-workflow" class="relative py-24 md:py-32">
	<div class="relative z-10 mx-auto max-w-7xl px-6">
		<!-- Section header -->
		<div class="mb-8 md:mb-12" use:reveal>
			<p class="mb-3 font-mono text-xs tracking-[0.2em] text-brand-primary uppercase">
				Development Pipeline
			</p>
			<h2 class="mb-4 font-display text-3xl font-bold text-surface-50 md:text-5xl">
				How I Work with AI
			</h2>
			<p class="max-w-2xl text-lg leading-relaxed text-surface-400">
				A deliberate, four-phase workflow where AI amplifies engineering judgment at every
				stage. The human stays in the loop at every decision point.
			</p>
		</div>

		<!-- Pipeline container: rail + phases -->
		<div class="relative flex">
			<!-- Desktop progress rail -->
			<aside
				class="sticky top-32 mr-12 hidden h-fit flex-col items-center self-start lg:flex"
				style="min-width: 3rem;"
			>
				{#each pipelinePhases as phase, i (phase.id)}
					<button
						class="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500"
						style="
							border-color: {activePhaseIndex >= i ? phase.color : 'rgba(255,255,255,0.08)'};
							background: {activePhaseIndex === i ? phase.color + '15' : 'var(--color-surface-950)'};
						"
						onclick={() => {
							phaseRefs[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}}
						aria-label="Scroll to {phase.phase} phase"
					>
						<span
							class="font-mono text-[10px] font-bold transition-colors duration-500"
							style="color: {activePhaseIndex >= i ? phase.color : 'var(--color-surface-600)'};"
						>
							{phase.number}
						</span>
						{#if activePhaseIndex === i && sectionInView}
							<div
								class="absolute inset-0 animate-ping rounded-full opacity-15"
								style="background: {phase.color};"
							></div>
						{/if}
					</button>

					{#if i < pipelinePhases.length - 1}
						<div
							class="w-px transition-all duration-700"
							style="
								height: 6rem;
								background: {activePhaseIndex > i
									? `linear-gradient(to bottom, ${phase.color}80, ${pipelinePhases[i + 1].color}80)`
									: 'rgba(255,255,255,0.06)'};
							"
						></div>
					{/if}
				{/each}
			</aside>

			<!-- Phase sections -->
			<div class="min-w-0 flex-1">
				{#each pipelinePhases as phase, i (phase.id)}
					<div
						bind:this={phaseRefs[i]}
						class="phase-section relative scroll-mt-28 transition-all duration-700"
						class:mb-24={i < pipelinePhases.length - 1}
						class:mb-0={i === pipelinePhases.length - 1}
						style="
							opacity: {sectionInView ? (activePhaseIndex === i ? 1 : 0.3) : 1};
							scale: {sectionInView && activePhaseIndex !== i ? 0.98 : 1};
						"
					>
						<!-- Phase-colored aurora glow -->
						<div
							class="pointer-events-none absolute -top-20 -left-20 h-[400px] w-[500px] rounded-full blur-[160px] transition-opacity duration-700"
							style="
								background: rgba({phase.rgb}, 0.05);
								opacity: {sectionInView && activePhaseIndex === i ? 1 : 0};
							"
						></div>

						<!-- Giant watermark number -->
						<div
							class="watermark pointer-events-none absolute -top-8 -left-4 select-none font-display leading-none lg:-left-8"
							class:active={sectionInView && activePhaseIndex === i}
							style="
								font-size: clamp(8rem, 18vw, 16rem);
								--wm-rgb: {phase.rgb};
								font-variation-settings: 'wght' 900, 'WONK' 0, 'opsz' 144;
							"
						>
							{phase.number}
						</div>

						<div class="relative" use:reveal={{ delay: i * 60 }}>
							<!-- Phase label -->
							<span
								class="mb-2 block font-mono text-[11px] font-semibold tracking-[0.25em] uppercase"
								style="color: {phase.color};"
							>
								Phase {phase.number}
							</span>

							<!-- Phase name -->
							<h3
								class="mb-2 font-display text-3xl font-bold text-surface-50 md:text-4xl lg:text-5xl"
								style="font-variation-settings: 'wght' 700, 'WONK' 0, 'opsz' 72;"
							>
								{phase.phase}
							</h3>

							<!-- Accent line -->
							<div
								class="accent-line mb-6 h-[3px] rounded-full"
								class:revealed={phaseRevealed[i]}
								style="background: {phase.color};"
							></div>

							<!-- Headline -->
							<p class="mb-4 text-lg font-medium text-surface-200 md:text-xl">
								{phase.headline}
							</p>

							<!-- Narrative -->
							<p class="mb-10 max-w-3xl text-base leading-relaxed text-surface-400 md:text-lg">
								{phase.narrative}
							</p>
						</div>

						<!-- Technique cards -->
						<div
							class="relative grid grid-cols-1 gap-5 md:grid-cols-2"
							class:lg:grid-cols-3={phase.techniques.length >= 3}
						>
							{#each phase.techniques as technique, ti (technique.name)}
								<div
									class="technique-card group"
									class:revealed={phaseRevealed[i]}
									style="
										--phase-color: {phase.color};
										--phase-rgb: {phase.rgb};
										--stagger: {ti * 120}ms;
									"
								>
									<div
										class="absolute top-0 left-0 h-full w-[3px] rounded-l-xl transition-all duration-500"
										style="
											background: {phase.color};
											box-shadow: 0 0 12px rgba({phase.rgb}, 0);
										"
									></div>

									<div
										class="pointer-events-none absolute -top-px -left-px h-20 w-20 rounded-tl-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
										style="background: radial-gradient(circle at 0% 0%, rgba({phase.rgb}, 0.12) 0%, transparent 70%);"
									></div>

									<div class="relative">
										<h4 class="mb-2 text-base font-bold text-surface-50">
											{technique.name}
										</h4>
										<p class="mb-4 text-[13px] leading-relaxed text-surface-400">
											{technique.description}
										</p>
									</div>

									<ul class="mt-auto space-y-2.5 border-t border-white/[0.04] pt-4">
										{#each technique.details as detail, di (detail)}
											<li
												class="flex items-start gap-2.5 text-xs text-surface-500 transition-all duration-300 group-hover:text-surface-400"
												style="transition-delay: {di * 50}ms;"
											>
												<span
													class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 group-hover:shadow-[0_0_6px_rgba(var(--phase-rgb),0.4)]"
													style="background: rgba({phase.rgb}, 0.4);"
												></span>
												<span>{detail}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>

						<!-- Phase connector (mobile + tablet) -->
						{#if i < pipelinePhases.length - 1}
							<div class="mt-16 flex items-center justify-start lg:hidden">
								<div class="flex flex-col items-center">
									<div
										class="h-10 w-px"
										style="background: linear-gradient(to bottom, {phase.color}60, {pipelinePhases[i + 1].color}60);"
									></div>
									<svg
										width="12"
										height="8"
										viewBox="0 0 12 8"
										fill="none"
										class="mt-0.5"
									>
										<path
											d="M1 1L6 6L11 1"
											stroke={pipelinePhases[i + 1].color}
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
											opacity="0.6"
										/>
									</svg>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Watermark number animation */
	.watermark {
		color: rgba(var(--wm-rgb), 0.03);
		transform: scale(0.92);
		opacity: 0.5;
		transition:
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.watermark.active {
		color: rgba(var(--wm-rgb), 0.07);
		transform: scale(1);
		opacity: 1;
	}

	/* Phase spotlight transition */
	.phase-section {
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			filter 0.7s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.accent-line {
		width: 0;
		transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
	}
	.accent-line.revealed {
		width: 5rem;
	}

	.technique-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 1.5rem 1.5rem 1.5rem 1.75rem;
		border-radius: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.03) 0%,
			transparent 50%,
			rgba(255, 255, 255, 0.01) 100%
		);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.04),
			0 1px 3px rgba(0, 0, 0, 0.3);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		overflow: hidden;

		opacity: 0;
		transform: translateY(1.5rem);
	}

	.technique-card.revealed {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--stagger, 0ms);
	}

	.technique-card:hover {
		border-color: rgba(255, 255, 255, 0.1);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			transparent 50%,
			rgba(255, 255, 255, 0.02) 100%
		);
		transform: translateY(-3px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 16px 48px rgba(0, 0, 0, 0.45);
	}

	.technique-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
	}
</style>
