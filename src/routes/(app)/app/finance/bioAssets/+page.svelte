<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { livePriceMap } from '$lib/liveAsset/stores';
	import PhCow from '~icons/ph/cow';
	import EggIcon from '~icons/ph/egg';
	import AddBioAssetModal from './AddBioAssetModal.svelte';
	import { liveAssetList } from '$lib/liveAsset/liveAssetList';
	import type { Component } from 'svelte';
	import { getBioAssets } from './bio.remote';
	import Button from '$lib/components/Button.svelte';

	const iconMap: Record<(typeof liveAssetList)[number], Component> = {
		cattle: PhCow,
		chicken: EggIcon
	};

	const assets = (await getBioAssets()).assets;

	const cattlePrice = livePriceMap['cattle'];
	const chickenPrice = livePriceMap['chicken'];
	const currentPrices = $derived({
		cattle: $cattlePrice,
		chicken: $chickenPrice
	});

	type Asset = (typeof assets)[number];

	let showingAddBioAsset = $state(false);
</script>

<div class="container">
	<div class="header">
		<p>Manage your livestock and other biological assets.</p>
		<Button
			onclick={() => {
				showingAddBioAsset = true;
			}}
		>
			Add Bio Asset
		</Button>
	</div>

	<AddBioAssetModal bind:showing={showingAddBioAsset} />

	<main>
		{#snippet cellName(row: Asset)}
			{@const Icon = iconMap[row.type]}
			<span class="nameCell">
				<span class="icon">
					{#if Icon}
						<Icon />
					{/if}
				</span>

				{row.name}
			</span>
		{/snippet}

		{#snippet typeCell(row: Asset)}
			<span class="capitalize">{row.type}</span>
		{/snippet}

		{#snippet valueCell(row: Asset)}
			{@const price = currentPrices[row.type as keyof typeof currentPrices]}
			<span class="value-cell">
				{#if price}
					${(row.mass * price).toFixed(2)}
				{:else}
					N/A
				{/if}
			</span>
		{/snippet}

		<DataTable
			data={assets}
			columns={[
				{ key: 'name', label: 'Name', cell: cellName },
				{ key: 'type', label: 'Type', cell: typeCell },
				{ key: 'mass', label: 'Mass (kg)' },
				{ key: 'value', label: 'Estimated Value', align: 'right', cell: valueCell },
				{ key: 'created', label: 'Created', format: (val) => new Date(val).toLocaleDateString() }
			]}
		/>
	</main>
</div>

<style>
	.nameCell {
		display: flex;
		align-items: start;
		justify-content: start;
		gap: 0.5rem;
	}

	.container {
		width: 100%;
		margin: 0 auto;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}

	p {
		color: var(--color);
	}

	.icon {
		color: var(--accent);
	}

	.capitalize {
		text-transform: capitalize;
	}

	.value-cell {
		font-size: 1rem;
		color: var(--accent-alt);
	}
</style>
