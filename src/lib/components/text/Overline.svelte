<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="eyebrow">
	{@render children?.()}
</div>

<style lang="scss">
	.eyebrow {
		font-family: 'DM Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--amber);
		margin-bottom: 6px;
	}
</style>
