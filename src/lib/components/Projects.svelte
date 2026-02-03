<script lang="ts">
    import { projects } from '$lib/data/projects';
</script>

<section id="projects" class="projects">
    <h2>Projects</h2>
    <div class="grid">
        {#each projects as project}
            <div class="card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div class="tags">
                    {#each project.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer">View Project →</a>
            </div>
        {/each}
    </div>
</section>

<style>
    .projects {
        padding: 4rem 2rem;
        max-width: 1000px;
        margin: 0 auto;
    }

    h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .card {
        padding: 1.5rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }

    p {
        color: #666;
        flex-grow: 1;
        margin-bottom: 1rem;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .tag {
        background: #f0f0f0;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }

    a {
        color: #000;
        text-decoration: none;
        font-weight: 500;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
