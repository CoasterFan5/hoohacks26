<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';

	type ItemType = {
		value: string;
		display: string;
	};

	let {
		value = $bindable(''),
		label,
		placeholder,
		items,
		addItemClick
	}: {
		value?: string;
		label: string;
		placeholder: string;
		items: ItemType[];
		addItemClick: VoidFunction;
	} = $props();

	let selectedItem: ItemType | undefined = $state(undefined);

	let ddOpen = $state(false);
	let ddHtmlItem: HTMLDivElement | undefined = $state();

	const windowMouseHandler: MouseEventHandler<Window> = (e) => {
		if (ddOpen && ddHtmlItem) {
			if (!ddHtmlItem.contains(e.target as HTMLHtmlElement)) {
				ddOpen = false;
			}
		}
	};

	const selectItem = (item: ItemType) => {
		selectedItem = item;
		value = item.value;
		ddOpen = false;
	};
</script>

<svelte:window onclick={windowMouseHandler} />

<div class="i" bind:this={ddHtmlItem}>
	<span>{label}</span>
	<button
		onclick={() => {
			ddOpen = !ddOpen;
		}}
		>{#if !selectedItem}{placeholder}{:else}{selectedItem.display}{/if}</button
	>
	{#if ddOpen}
		<div class="optionsPicker">
			{#each items as item (item.value)}
				<button
					onclick={() => {
						selectItem(item);
					}}
				>
					{item.display}
				</button>
			{/each}
			<button class="newItem" onclick={addItemClick}> + add Item </button>
		</div>
	{/if}
</div>

<style lang="scss">
	.i {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		width: 100%;
		position: relative;

		button {
			text-align: left;
			width: 100%;
			border-radius: 0.25rem;
			padding: 0.25rem;
			font-size: 0.9rem;
			outline: 0px;
			border: 1px solid var(--border);
			background: var(--background);
			font-size: 1rem;
			cursor: pointer;
		}
	}

	.optionsPicker {
		position: absolute;
		left: 0px;
		width: 100%;
		top: calc(100% + 0.25rem);
		box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.25);

		button {
			width: 100%;
		}
	}
</style>
