<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource-variable/roboto';

	let { children } = $props();

	import { initializeAuth } from '$lib/stores/auth';

	$effect(() => {
		initializeAuth();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style lang="scss">
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
