<script lang="ts">
    import { skills } from '$lib/data/skills';
</script>

<section id="skills" class="skills">
    <h2>Skills</h2>
    <div class="categories">
        {#each ['Frontend', 'Backend', 'Tools'] as category}
            <div class="category">
                <h3>{category}</h3>
                <ul>
                    {#each skills.filter(s => s.category === category) as skill}
                        <li>
                            <span class="name">{skill.name}</span>
                            <span class="level">{skill.level}</span>
                        </li>
                    {/each}
                </ul>
            </div>
        {/each}
    </div>
</section>

<style>
    .skills {
        padding: 4rem 2rem;
        max-width: 800px;
        margin: 0 auto;
        background: #fafafa;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
    }

    h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #ddd;
        padding-bottom: 0.5rem;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .level {
        color: #888;
        font-size: 0.9rem;
    }
</style>
