<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<h2>
	{@render children?.()}
</h2>

<style lang="scss">
	h2 {
		font-size: 1.2rem;
		font-weight: 500;
		width: 100%;
		align-items: start;
		justify-content: start;
		margin: 0 0.5rem;
	}
</style>
