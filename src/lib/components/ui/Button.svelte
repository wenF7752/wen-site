<script lang="ts">
	import { type Snippet } from 'svelte';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		href?: string;
		children: Snippet;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}

	let { variant = 'primary', href, children, ...rest }: Props = $props();

	const baseClass = 'btn';
	const variants = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		outline: 'btn-outline',
		ghost: 'hover:bg-surface-100 text-surface-600'
	};

	const classes = $derived(`${baseClass} ${variants[variant]}`);
</script>

{#if href}
	<a {href} class={classes} {...rest} use:magnetic={{ strength: 0.2, radius: 80 }}>
		{@render children()}
	</a>
{:else}
	<button class={classes} {...rest} use:magnetic={{ strength: 0.2, radius: 80 }}>
		{@render children()}
	</button>
{/if}
