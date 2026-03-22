<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { livePriceMap } from '$lib/liveAsset/stores';
	import PhCow from '~icons/ph/cow';
	import AddBioAssetModal from './AddBioAssetModal.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data } = $props();

	const cattlePrice = livePriceMap['cattle'];

	type Asset = (typeof data.assets)[number];

	let showingAddBioAsset = $state(false);
</script>

<div class="page-container">
	<div class="header">
		<p>Manage your livestock and other biological assets.</p>
		<Button
			onclick={() => {
				showingAddBioAsset = true;
			}}
		>
			Add Asset
		</Button>
	</div>

	<AddBioAssetModal bind:showing={showingAddBioAsset} />

	<main>
		{#snippet cellName(row: Asset)}
			<span class="nameCell">
				<span class="icon">
					{#if row.type === 'cattle'}
						<PhCow />
					{/if}
				</span>

				{row.name}
			</span>
		{/snippet}

		{#snippet typeCell(row: Asset)}
			<span class="capitalize">{row.type}</span>
		{/snippet}

		{#snippet valueCell(row: Asset)}
			<span class="value-cell">
				{#if row.type === 'cattle' && cattlePrice}
					${(row.mass * $cattlePrice).toFixed(2)}
				{:else}
					N/A
				{/if}
			</span>
		{/snippet}

		<DataTable
			data={data.assets}
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

	.page-container {
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
		opacity: 0.7;
		font-size: 1.1rem;
	}

	.icon {
		color: var(--accent);
	}

	.capitalize {
		text-transform: capitalize;
	}

	.value-cell {
		font-family: monospace;
		font-size: 1.1rem;
		color: var(--accent-alt);
	}
</style>
