<script lang="ts">
	import '@fontsource-variable/roboto';
	import '@fontsource/lora/400.css';
	import '@fontsource/lora/600.css';
	import '@fontsource/lora/700.css';
	import '@fontsource/dm-sans/300.css';
	import '@fontsource/dm-sans/400.css';
	import '@fontsource/dm-sans/500.css';
	import '@fontsource/dm-mono/400.css';
	import '@fontsource/dm-mono/500.css';
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

{@render children?.()}

<style lang="scss">
	:global(:root) {
		--font-serif: 'Lora', serif;
		--font-sans: 'DM Sans', sans-serif;
		--font-mono: 'DM Mono', monospace;

		--soil: #0f0a04;
		--earth: #1c1208;
		--bark: #2e1e0a;
		--rust: #c4541a;
		--amber: #d4922a;
		--wheat: #e8c87a;
		--cream: #f0e8d5;
		--sky: #7fb5c8;
		--muted: #8a7a62;
		--sage: #6b8f5e;
		--green: #5a9e5a;
		--red: #c44040;
	}

	:global(*) {
		font-family: 'Roboto Variable', sans-serif;
		--background: #1c1208;

		--color: #f1f1f1;
		--error: #d4922a;

		--accent: #c4541a;
		--accent-alt: #d46320;

		--border: #534429;

		color: var(--color);
	}

	:global(body) {
		background: var(--background);
	}
</style>
