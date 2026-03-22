<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		children,
		showing = $bindable(false),
		onClose
	}: {
		children?: Snippet<[]>;
		showing?: boolean;
		onClose?: () => void;
	} = $props();

	const handleClose: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (e.target != e.currentTarget) {
			return;
		}
		showing = false;
		onClose?.();
	};
</script>

{#if showing}
	<button class="modalBg" onclick={handleClose}>
		<div class="modal">
			{@render children?.()}
		</div>
	</button>
{/if}

<style>
	.modalBg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		backdrop-filter: blur(3px);
		border: none;
		padding: 0;
		margin: 0;
		cursor: default;
	}

	.modal {
		box-sizing: border-box;
		background: var(--background);
		border: 1px solid var(--border);
		padding: 1rem;
		border-radius: 0.5rem;
		max-width: 20rem;
		width: 100%;
	}
</style>
