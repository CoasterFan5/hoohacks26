<script lang="ts">
	import FormButton from '$lib/components/FormButton.svelte';
	import FormHeader from '$lib/components/FormHeader.svelte';
	import InputRow from '$lib/components/InputRow.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SuperDropDown from '$lib/components/SuperDropDown.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { createAsset, createCategory, getCategories } from './assets.remote';

	let {
		showing = $bindable(),
		onAdd
	}: {
		showing: boolean;
		onAdd: VoidFunction;
	} = $props();

	let showingAddCategory = $state(false);

	let newCategory = $state({
		name: ''
	});

	let newAsset = $state({
		name: '',
		categoryId: '',
		valuation: 0
	});

	const addCategory = async () => {
		console.info('adding');
		createCategory(newCategory)
			.then(() => {
				showingAddCategory = false;
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(async () => {
				categories = await getCategories();
			});
	};

	const addAsset = async () => {
		createAsset({
			name: newAsset.name,
			value: newAsset.valuation,
			categoryId: newAsset.categoryId
		})
			.then(() => {
				showing = false;
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				onAdd();
			});
	};

	let categories = $state(await getCategories());

	let categoryMapped = $derived(
		categories.map((item) => {
			return {
				value: item.id,
				display: item.name
			};
		})
	);
</script>

<Modal bind:showing>
	<InputRow>
		<FormHeader>New Asset</FormHeader>
		<TextInput label="Name" placeholder="Tractor" bind:value={newAsset.name} />
		<SuperDropDown
			placeholder="Select Category"
			label="Category"
			items={categoryMapped}
			bind:value={newAsset.categoryId}
			addItemClick={() => {
				showingAddCategory = true;
			}}
		/>
		<TextInput
			label="Valuation"
			placeholder="100.00"
			validator={(v) => {
				const n = parseInt(v);
				if (isNaN(n)) {
					return 'Could not parse number';
				} else {
					newAsset.valuation = n;
					return '';
				}
			}}
		/>
		<FormButton onclick={addAsset}>Create!</FormButton>
	</InputRow>
</Modal>

<Modal bind:showing={showingAddCategory}>
	<InputRow>
		<FormHeader>Add Category</FormHeader>
		<TextInput bind:value={newCategory.name} label="Name" placeholder="Vehicals" />
		<FormButton onclick={addCategory}>Create</FormButton>
	</InputRow>
</Modal>
