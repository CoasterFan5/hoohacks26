<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import AddAssetModal from './AddAssetModal.svelte';
	import { getAssets, getCategories } from './assets.remote';

	let assets = $state(await getAssets());
	type Asset = (typeof assets)[number];

	let showingAddAsset = $state(false);

	const categories = await getCategories();
	let categoryMap: Record<string, string> = $state({});

	$effect(() => {
		for (const item of categories) {
			categoryMap[item.id] = item.name;
		}
	});
</script>

<AddAssetModal
	bind:showing={showingAddAsset}
	onAdd={async () => {
		console.log('refreshing');
		getAssets().then((v) => {
			assets = v;
		});
		invalidateAll();
	}}
/>

<div class="container">
	<div class="header">
		<p>Manage your assets!</p>
		<Button
			onclick={() => {
				showingAddAsset = true;
			}}>New Asset</Button
		>
	</div>

	{#snippet categoryCell(row: Asset)}
		{#if categoryMap[row.categoryId]}
			{categoryMap[row.categoryId]}
		{:else}
			No Category
		{/if}
	{/snippet}

	<DataTable
		data={assets}
		columns={[
			{ key: 'name', label: 'name' },
			{
				key: 'category',
				label: 'category',
				cell: categoryCell
			},
			{
				key: 'value',
				label: 'valuation',
				format: (_, r) => {
					return `$${r.valuation.toFixed(2)}`;
				}
			}
		]}
	/>
</div>

<style lang="scss">
	.container {
		width: 100%;
		margin: 0 auto;
	}

	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1rem;

		p {
			margin: 0;
		}
	}
</style>
