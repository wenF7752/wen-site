<script lang="ts">
	import { aiSkills, workflowSteps } from '$lib/data/ai-workflow';
	import { reveal } from '$lib/actions/reveal';
	import ToolCard from '../ui/ToolCard.svelte';
</script>

<section id="ai-workflow" class="relative py-24 md:py-32">
	<!-- Subtle aurora glow -->
	<div
		class="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/[0.04] blur-[160px]"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6">
		<div class="mb-16" use:reveal>
			<h2 class="mb-4">How I Work with AI</h2>
			<p class="max-w-2xl text-surface-400">
				A deliberate workflow where AI amplifies engineering judgment, not replaces it. Every
				capability is practiced, not just listed. The human stays in the loop at every decision
				point.
			</p>
		</div>

		<!-- Skill Cards -->
		<div class="mb-24 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each aiSkills as skill, i (skill.name)}
				<div use:reveal={{ delay: i * 80 }}>
					<ToolCard {skill} />
				</div>
			{/each}
		</div>

		<!-- Workflow Pipeline -->
		<div class="mb-10" use:reveal>
			<h3
				class="mb-2 text-sm font-semibold tracking-widest text-surface-500 uppercase"
				style="font-size: 0.8125rem;"
			>
				Development Pipeline
			</h3>
		</div>

		<!-- Desktop pipeline (horizontal) -->
		<div class="hidden lg:block" use:reveal={{ delay: 100 }}>
			<div class="flex items-stretch">
				{#each workflowSteps as step, i (step.phase)}
					<div class="flex flex-1 items-stretch">
						<div
							class="flex flex-1 flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
						>
							<span class="mb-3 font-mono text-xs text-brand-primary">
								{String(i + 1).padStart(2, '0')}
							</span>
							<h4 class="mb-2 text-lg font-bold text-surface-50">{step.phase}</h4>
							<p class="mb-4 text-sm text-surface-400">{step.description}</p>
							<p class="mb-4 text-xs leading-relaxed text-surface-500">{step.detail}</p>
							<div class="mt-auto flex flex-wrap gap-1.5">
								{#each step.skills as skill (skill)}
									<span
										class="rounded-full border border-brand-accent/20 bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent"
									>
										{skill}
									</span>
								{/each}
							</div>
						</div>
						{#if i < workflowSteps.length - 1}
							<div class="flex w-8 shrink-0 items-center justify-center">
								<div class="h-px w-full border-t border-dashed border-surface-700"></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Mobile/tablet pipeline (vertical) -->
		<div class="lg:hidden">
			<div class="flex flex-col">
				{#each workflowSteps as step, i (step.phase)}
					<div class="flex flex-col" use:reveal={{ delay: i * 100 }}>
						<div
							class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
						>
							<span class="mb-3 block font-mono text-xs text-brand-primary">
								{String(i + 1).padStart(2, '0')}
							</span>
							<h4 class="mb-2 text-lg font-bold text-surface-50">{step.phase}</h4>
							<p class="mb-4 text-sm text-surface-400">{step.description}</p>
							<p class="mb-4 text-xs leading-relaxed text-surface-500">{step.detail}</p>
							<div class="flex flex-wrap gap-1.5">
								{#each step.skills as skill (skill)}
									<span
										class="rounded-full border border-brand-accent/20 bg-brand-accent/10 px-2.5 py-0.5 text-xs font-medium text-brand-accent"
									>
										{skill}
									</span>
								{/each}
							</div>
						</div>
						{#if i < workflowSteps.length - 1}
							<div class="flex h-8 items-center justify-center">
								<div class="h-full w-px border-l border-dashed border-surface-700"></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
