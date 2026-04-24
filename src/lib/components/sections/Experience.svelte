<script lang="ts">
	import { latestRole } from '$lib/data/experience';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="experience" class="relative py-24 md:py-32">
	<!-- Asymmetric aurora: emerald blob top-right, balancing AIWorkflow's centered accent -->
	<div
		class="pointer-events-none absolute -top-20 right-0 h-[500px] w-[600px] translate-x-1/4 rounded-full bg-brand-primary/[0.05] blur-[160px]"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl px-6">
		<!-- Editorial heading block -->
		<div class="mb-16 max-w-2xl" use:reveal>
			<div class="mb-3 font-mono text-sm tracking-wider text-brand-primary">
				Current Engagement
			</div>
			<h2 class="mb-4">Experience</h2>
			<p class="text-surface-400">
				What I'm shipping right now. Full-stack delivery with deliberate AI leverage at every
				checkpoint.
			</p>
		</div>

		<!-- Asymmetric grid: sticky meta rail (4) + engagement log (8) -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
			<!-- Meta rail -->
			<aside class="lg:col-span-4" use:reveal={{ delay: 80 }}>
				<div
					class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] lg:sticky lg:top-28"
				>
					<div
						class="mb-3 text-[10px] font-semibold tracking-widest text-surface-500 uppercase"
					>
						Role
					</div>
					<h3 class="mb-5 text-2xl font-bold text-surface-50">
						{latestRole.title}
					</h3>

					<div class="flex flex-col gap-3 text-sm">
						<div class="flex items-center gap-2.5">
							<span
								class="relative inline-flex h-2 w-2 shrink-0 items-center justify-center"
								aria-hidden="true"
							>
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-60"
								></span>
								<span
									class="relative inline-flex h-2 w-2 rounded-full bg-brand-primary"
								></span>
							</span>
							<span class="font-mono text-brand-primary">{latestRole.period}</span>
						</div>

						<div class="flex items-center gap-2.5 text-surface-400">
							<svg
								class="h-4 w-4 shrink-0"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.75"
								aria-hidden="true"
							>
								<path
									d="M12 22s-8-7.5-8-13a8 8 0 1 1 16 0c0 5.5-8 13-8 13z"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<circle cx="12" cy="9" r="3" />
							</svg>
							<span>{latestRole.location}</span>
						</div>
					</div>
				</div>
			</aside>

			<!-- Numbered engagement log -->
			<div class="lg:col-span-8">
				<div
					class="mb-4 text-[10px] font-semibold tracking-widest text-surface-500 uppercase"
					use:reveal={{ delay: 100 }}
				>
					Engagements
				</div>
				<ol class="flex flex-col gap-3">
					{#each latestRole.bullets as bullet, i (bullet)}
						<li use:reveal={{ delay: 140 + i * 60 }}>
							<div
								class="group flex gap-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-white/[0.04] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
							>
								<span
									class="shrink-0 font-mono text-xs text-brand-primary/70 transition-colors duration-300 group-hover:text-brand-primary"
									style="font-variant-numeric: tabular-nums;"
								>
									{String(i + 1).padStart(2, '0')}
								</span>
								<p class="text-sm leading-relaxed text-surface-300">{bullet}</p>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</section>
