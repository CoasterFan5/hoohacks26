<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<h1 class="pageHeader">
	{@render children?.()}
</h1>

<style lang="scss">
	.pageHeader {
		font-family: 'Lora', serif;
		font-size: clamp(22px, 3vw, 32px);
		font-weight: 700;
		color: var(--cream);
		line-height: 1.1;
	}
</style>
