<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormHeader from '$lib/components/FormHeader.svelte';
	import InputRow from '$lib/components/InputRow.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { addBioAsset } from './bio.remote';
	import { liveAssetList, type LiveAssetType } from '$lib/liveAsset/liveAssetList';

	let {
		showing = $bindable(false)
	}: {
		showing: boolean;
	} = $props();

	let name = $state('');
	let massString = $state('');
	let type = $state<LiveAssetType>('cattle');

	const create = async () => {
		addBioAsset({
			name: name,
			mass: parseInt(massString),
			type: type
		})
			.catch((e) => {
				invalidateAll();
				console.error(e);
			})
			.finally(() => {
				showing = false;

				invalidateAll();
			});
	};
</script>

<Modal bind:showing>
	<InputRow>
		<FormHeader>Add Bio Asset</FormHeader>
		<TextInput label="Name" placeholder="Merry the cow" bind:value={name} />
		<TextInput
			label="Mass (kg)"
			placeholder="100"
			bind:value={massString}
			validator={(v) => {
				const parsed = parseInt(v);
				if (isNaN(parsed)) {
					return 'Could not parse number';
				}
			}}
		/>
		<div class="input-group">
			<span class="label">Type</span>
			<select bind:value={type} class="select-input">
				{#each liveAssetList as assetType (assetType)}
					<option value={assetType} style="text-transform: capitalize;">{assetType}</option>
				{/each}
			</select>
		</div>
		<FormButton onclick={create}>Create</FormButton>
	</InputRow>
</Modal>

<style lang="scss">
	.input-group {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: start;
	}

	.label {
		font-size: 0.85rem;
		color: var(--color);
		margin-bottom: 0.25rem;
	}

	.select-input {
		width: 100%;
		border-radius: 0.25rem;
		padding: 0.25rem;
		border: 1px solid var(--border);
		background: var(--background);
		font-size: 1rem;
		color: var(--color);
	}
</style>
