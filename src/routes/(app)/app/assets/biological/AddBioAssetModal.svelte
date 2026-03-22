<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormHeader from '$lib/components/FormHeader.svelte';
	import InputRow from '$lib/components/InputRow.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { addBioAsset } from './bio.remote';

	let {
		showing = $bindable(false)
	}: {
		showing: boolean;
	} = $props();

	let name = $state('');
	let massString = $state('');

	const create = async () => {
		addBioAsset({
			name: name,
			mass: parseInt(massString)
		}).catch((e) => {
			invalidateAll();
			console.error(e);
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
		<FormButton onclick={create}>Create</FormButton>
	</InputRow>
</Modal>
