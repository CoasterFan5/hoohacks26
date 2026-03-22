<script lang="ts">
	import FormButton from '$lib/components/FormButton.svelte';
	import FormHeader from '$lib/components/FormHeader.svelte';
	import InputRow from '$lib/components/InputRow.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let {
		showing = $bindable(false)
	}: {
		showing: boolean;
	} = $props();

	let name = $state('');
	let massString = $state('');

	const create = async () => {
		showing = false;
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
