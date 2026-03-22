<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		children,
		onclick
	}: {
		children: Snippet<[]>;
		onclick?: MouseEventHandler<HTMLButtonElement>;
	} = $props();
</script>

<button {onclick}>
	{@render children?.()}
</button>

<style lang="scss">
	button {
		border-radius: 0.25rem;
		font-size: 1rem;
		padding: 0.25rem;
		border: 0px;
		outline: 0px;
		width: 100%;
		border: 0px;
		background: var(--accent);
		color: var(--color);
		cursor: pointer;
	}
</style>
