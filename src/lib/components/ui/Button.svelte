<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type BaseProps = {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		children: Snippet;
	};

	type Props = BaseProps &
		(
			| ({ href: string } & Omit<HTMLAnchorAttributes, 'children'>)
			| ({ href?: undefined } & Omit<HTMLButtonAttributes, 'children'>)
		);

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
	{@const anchorRest = rest as Omit<HTMLAnchorAttributes, 'href' | 'children'>}
	<a {href} class={classes} {...anchorRest}>
		{@render children()}
	</a>
{:else}
	{@const buttonRest = rest as Omit<HTMLButtonAttributes, 'children'>}
	<button class={classes} {...buttonRest}>
		{@render children()}
	</button>
{/if}
