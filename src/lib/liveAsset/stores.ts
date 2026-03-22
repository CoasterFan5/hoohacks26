import { writable, type Writable } from "svelte/store";

// as a cheeky little hack, we will just fluctuate prices randomly by +- 0.01 every second

setInterval(() => {
  for (const key in livePriceMap) {
    livePriceMap[key].update((v) => {
      if (Math.random() > 0.5) {
        return v + 0.01
      } else {
        return v - 0.01
      }
    })
  }
}, 1000)

export const livePriceMap: Record<string, Writable<number>> = {
  cattle: writable(5.6)
}
