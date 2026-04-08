<script lang="ts">
	import { skills } from '$lib/data/skills';

	const levels = {
		Beginner: 25,
		Intermediate: 50,
		Advanced: 75,
		Expert: 100
	};
</script>

<section id="skills" class="bg-surface-50 py-24">
	<div class="mx-auto max-w-7xl px-6">
		<div class="mb-16">
			<h2 class="mb-4">Expertise</h2>
			<p class="max-w-2xl text-surface-500">
				Technical proficiency across the full stack, with a focus on type-safety, performance, and
				maintainability.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
			{#each skills as skill (skill.name)}
				<div class="group">
					<div class="mb-2 flex items-end justify-between">
						<span class="font-bold text-surface-800">{skill.name}</span>
						<span class="font-mono text-xs text-surface-400 uppercase">{skill.level}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-surface-200">
						<div
							class="h-full bg-brand-primary transition-all duration-500 ease-out group-hover:bg-brand-accent"
							style="width: {levels[skill.level]}%"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
