<script lang="ts">
	import { livePriceMap } from "$lib/liveAsset/stores";
	import LiveRow from "./LiveRow.svelte";

</script>
<h2>Track live cattle prices!</h2>
{#each Object.entries(livePriceMap) as item, index (index)}
    <LiveRow priceStoreName={item[0]} priceStore={item[1]}/>
{/each}
