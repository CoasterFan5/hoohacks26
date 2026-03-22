<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { livePriceMap } from '$lib/liveAsset/stores';
	import PhCow from '~icons/ph/cow';
	import AddBioAssetModal from './AddBioAssetModal.svelte';

	let { data } = $props();

	const cattlePrice = livePriceMap['cattle'];

	let showingAddModal = $state(false);
</script>

<h2>Bio Asset Manager</h2>
<button
	onclick={() => {
		showingAddModal = true;
	}}
>
	Add Item
</button>

<AddBioAssetModal bind:showing={showingAddModal} />

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Mass</th>
			<th>Estimated Value</th>
			<th>Created</th>
		</tr>
	</thead>
	<tbody>
		{#each data.assets as asset (asset.id)}
			<tr>
				<td><PhCow /></td>
			</tr>
		{/each}
	</tbody>
</table>
