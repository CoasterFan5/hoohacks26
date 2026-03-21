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
	:global(*) {
		font-family: 'Roboto Variable', sans-serif;
	}
</style>
