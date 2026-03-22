<script lang="ts">
	import { livePriceMap } from '$lib/liveAsset/stores';
	import PhCow from '~icons/ph/cow';

	let { data } = $props();

	const cattlePrice = livePriceMap['cattle'];
</script>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Mass</th>
			<th>Estimated Value</th>
			<th>Created</th>
			<th></th>
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
