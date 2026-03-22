<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	};
</script>

<button class="modalBg">
	<div class="modal">
		{@render children?.()}
	</div>
</button>
