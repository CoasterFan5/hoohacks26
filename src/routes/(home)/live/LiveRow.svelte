<script lang="ts">
	import { type Writable } from 'svelte/store';
	const { priceStoreName, priceStore }: { priceStoreName: string; priceStore: Writable<number> } =
		$props();

	// Format the asset name (e.g., "live_cattle" -> "Live Cattle")
	const formattedName = priceStoreName
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
</script>

<div class="live-row">
	<div class="asset-name">{formattedName}</div>
	<div class="asset-price">
		{#if $priceStore !== undefined && $priceStore !== null}
			${$priceStore.toFixed(2)}
		{:else}
			<span class="loading">Loading...</span>
		{/if}
	</div>
</div>

<style>
	.live-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.asset-name {
		font-family: 'DM Mono', monospace;
		font-size: 12px;
		color: var(--muted, #8a7a62);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.asset-price {
		font-family: 'Lora', serif;
		font-size: 36px;
		font-weight: 600;
		color: var(--amber, #d4922a);
		line-height: 1.1;
	}

	.loading {
		font-size: 18px;
		color: var(--muted, #8a7a62);
		font-family: 'DM Sans', sans-serif;
		font-style: italic;
	}
</style>
