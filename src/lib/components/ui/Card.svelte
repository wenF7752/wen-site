<script lang="ts">
	import { type Snippet } from 'svelte';
	import { tilt } from '$lib/actions/tilt';

	interface Props {
		children: Snippet;
		class?: string;
		enableTilt?: boolean;
	}

	let { children, class: className = '', enableTilt = true }: Props = $props();
</script>

{#if enableTilt}
	<div class="card {className}" use:tilt={{ intensity: 6, scale: 1.01 }}>
		{@render children()}
	</div>
{:else}
	<div class="card {className}">
		{@render children()}
	</div>
{/if}
