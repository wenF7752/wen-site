<script lang="ts">
    import Button from '../ui/Button.svelte';

    let isMenuOpen = $state(false);

    const toggleMenu = () => isMenuOpen = !isMenuOpen;
</script>

<nav class="glass-nav">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" class="text-2xl font-bold text-brand-primary tracking-tight">
            WEN<span class="text-brand-accent">.</span>
        </a>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
            <a href="#projects" class="text-surface-600 hover:text-brand-primary font-medium transition-colors">Projects</a>
            <a href="#skills" class="text-surface-600 hover:text-brand-primary font-medium transition-colors">Skills</a>
            <Button variant="outline" href="#contact">Contact</Button>
        </div>

        <!-- Mobile Toggle -->
        <button class="md:hidden p-2 text-surface-600" onclick={toggleMenu} aria-label="Toggle Menu">
            {#if isMenuOpen}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            {/if}
        </button>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if isMenuOpen}
        <div class="fixed inset-0 top-20 bg-white z-40 flex flex-col p-8 gap-6 md:hidden">
            <a href="#projects" class="text-2xl font-bold text-surface-900" onclick={toggleMenu}>Projects</a>
            <a href="#skills" class="text-2xl font-bold text-surface-900" onclick={toggleMenu}>Skills</a>
            <Button variant="primary" href="#contact" class="w-full text-xl py-4" onclick={toggleMenu}>Contact</Button>
        </div>
    {/if}
</nav>
