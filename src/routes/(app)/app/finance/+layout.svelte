<script lang="ts">
	import Overline from '$lib/components/text/Overline.svelte';
	import PageHeader from '$lib/components/text/PageHeader.svelte';
	import type { Snippet } from 'svelte';
	import PageTabs from './PageTabs.svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="content">
		<div class="header">
			<Overline>Core Features</Overline>
			<PageHeader>Core Financial Management</PageHeader>
		</div>
		<PageTabs />
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: start;
	}

	.content {
		width: 100%;
		display: flex;
		gap: 2rem;
		flex-direction: column;
		max-width: 900px;
	}

	.header {
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(212, 146, 42, 0.12);
	}
</style>
