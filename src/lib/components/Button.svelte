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
		padding: 0.25rem 0.5rem;
		border: 0px;
		outline: 0px;
		border: 0px;
		background: var(--accent);
		color: var(--color);
		cursor: pointer;
		transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s;

		&:hover {
			background: var(--accent-alt);
		}
	}
</style>
