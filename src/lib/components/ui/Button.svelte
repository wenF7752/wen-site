<script lang="ts">
    import { type Snippet } from 'svelte';

    interface Props {
        variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
        href?: string;
        children: Snippet;
        [key: string]: any;
    }

    let { variant = 'primary', href, children, ...rest }: Props = $props();

    const baseClass = "btn";
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "hover:bg-surface-100 text-surface-600"
    };

    const classes = $derived(`${baseClass} ${variants[variant]}`);
</script>

{#if href}
    <a {href} class={classes} {...rest}>
        {@render children()}
    </a>
{:else}
    <button class={classes} {...rest}>
        {@render children()}
    </button>
{/if}
