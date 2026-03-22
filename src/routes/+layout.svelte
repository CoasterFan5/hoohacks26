<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource-variable/roboto';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style lang="scss">
	:global(:root) {
		--soil: #0f0a04;
		--earth: #1c1208;
		--bark: #2e1e0a;
		--rust: #c4541a;
		--amber: #d4922a;
		--wheat: #e8c87a;
		--cream: #f0e8d5;
		--muted: #8a7a62;
		--sage: #6b8f5e;
		--green: #5a9e5a;
		--red: #c44040;
	}

	:global(*) {
		font-family: 'Roboto Variable', sans-serif;
		--background: #110b05;

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
