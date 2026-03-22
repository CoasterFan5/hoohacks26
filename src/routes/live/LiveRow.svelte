<script lang="ts">
import { type Writable } from "svelte/store";
  const {
    priceStoreName,
    priceStore
  }: {priceStoreName: string, priceStore: Writable<number>} = $props()
</script>

<div>
    {priceStoreName}: {$priceStore}
</div>
