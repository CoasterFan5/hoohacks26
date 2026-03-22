<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		value = $bindable(''),
		label,
		validator,
		placeholder
	}: {
		value?: string;
		label: string;
		validator?: (value: string) => string | undefined;
		placeholder: string;
	} = $props();

	let validatorMessage = $state('');

	const changeEventHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (validator) {
			const v = validator(e.currentTarget.value);
			if (v) {
				validatorMessage = v;
			} else {
				validatorMessage = '';
			}
		}
	};
</script>

<div class="i">
	<span>{label}</span>
	<input oninput={changeEventHandler} bind:value {placeholder} />
	{#if validatorMessage}
		<span class="validatorError">{validatorMessage}</span>
	{/if}
</div>

<style lang="scss">
	.i {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		width: 100%;

		input {
			width: 100%;
			border-radius: 0.25rem;
			padding: 0.25rem;
			font-size: 0.9rem;
			outline: 0px;
			border: 1px solid var(--border);
			background: var(--background);
			font-size: 1rem;
		}
	}

	.validatorError {
		color: var(--red);
	}
</style>
