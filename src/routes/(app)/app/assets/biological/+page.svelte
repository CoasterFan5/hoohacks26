<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { livePriceMap } from '$lib/liveAsset/stores';
	import PhCow from '~icons/ph/cow';
	import AddBioAssetModal from './AddBioAssetModal.svelte';

	let { data } = $props();

	const cattlePrice = livePriceMap['cattle'];

	type Asset = (typeof data.assets)[number];

	let showingAddBioAsset = $state(false);
</script>

<div class="page-container">
	<header>
		<h1>Biological Assets</h1>
		<p>Manage your livestock and other biological assets.</p>
	</header>

	<button
		onclick={() => {
			showingAddBioAsset = true;
		}}
	>
		Add Asset
	</button>

	<AddBioAssetModal bind:showing={showingAddBioAsset} />

	<main>
		{#snippet iconCell(row: Asset)}
			<span class="icon-cell">
				{#if row.type === 'cattle'}
					<PhCow />
				{/if}
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
				{ key: 'icon', label: 'Icon', align: 'center', cell: iconCell },
				{ key: 'name', label: 'Name' },
				{ key: 'type', label: 'Type', cell: typeCell },
				{ key: 'mass', label: 'Mass (kg)' },
				{ key: 'value', label: 'Estimated Value', align: 'right', cell: valueCell },
				{ key: 'created', label: 'Created', format: (val) => new Date(val).toLocaleDateString() }
			]}
		/>
	</main>
</div>

<style>
	.page-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: var(--color);
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--color);
		opacity: 0.7;
		font-size: 1.1rem;
	}

	.icon-cell {
		font-size: 1.5rem;
		color: var(--accent);
		display: inline-flex;
		align-items: center;
		justify-content: center;
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
