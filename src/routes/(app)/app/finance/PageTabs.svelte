<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div class="tabs">
	<a href={resolve('/app/finance')} class="tab" class:active={page.url.pathname == '/app/finance'}
		>Overview</a
	>
	<a
		href={resolve('/app/finance/assets')}
		class:active={page.url.pathname == '/app/finance/assets'}
		class="tab">Assets</a
	>
	<a
		href={resolve('/app/finance/bioAssets')}
		class:active={page.url.pathname == '/app/finance/bioAssets'}
		class="tab"
	>
		Bio Assets
	</a>
</div>

<style>
	.tabs {
		display: flex;
		gap: 2px;
		border-bottom: 1px solid rgba(212, 146, 42, 0.12);
		flex-wrap: wrap;
	}
	.tab {
		background: none;
		text-decoration: none;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 10px 18px;
		margin-bottom: -1px;
		font-family: 'DM Sans', sans-serif;
		font-size: 14px;
		color: var(--muted);
		cursor: pointer;
		transition:
			color 0.18s,
			border-color 0.18s;
	}
	.tab:hover {
		color: var(--cream);
	}
	.tab.active {
		color: var(--wheat);
		border-bottom-color: var(--amber);
	}
</style>
