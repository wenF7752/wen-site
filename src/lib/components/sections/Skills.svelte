<script lang="ts">
    import { skills } from '$lib/data/skills';

    const levels = {
        "Beginner": 25,
        "Intermediate": 50,
        "Advanced": 75,
        "Expert": 100
    };
</script>

<section id="skills" class="py-24 bg-surface-50">
    <div class="max-w-7xl mx-auto px-6">
        <div class="mb-16">
            <h2 class="mb-4">Expertise</h2>
            <p class="text-surface-500 max-w-2xl">
                Technical proficiency across the full stack, with a focus on 
                type-safety, performance, and maintainability.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {#each skills as skill}
                <div class="group">
                    <div class="flex justify-between items-end mb-2">
                        <span class="font-bold text-surface-800">{skill.name}</span>
                        <span class="text-xs font-mono text-surface-400 uppercase">{skill.level}</span>
                    </div>
                    <div class="h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div 
                            class="h-full bg-brand-primary group-hover:bg-brand-accent transition-all duration-500 ease-out" 
                            style="width: {levels[skill.level]}%"
                        ></div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
