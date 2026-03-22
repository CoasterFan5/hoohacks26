import { writable, type Writable } from 'svelte/store';
import { liveAssetList } from './liveAssetList';

// as a cheeky little hack, we will just fluctuate prices randomly by +- 0.01 every second

setInterval(() => {
	for (const key in livePriceMap) {
		livePriceMap[key as keyof typeof livePriceMap].update((v: number) => {
			if (Math.random() > 0.5) {
				return v + Math.random() * 0.025;
			} else {
				return v - Math.random() * 0.025;
			}
		});
	}
}, 10_000);

export const livePriceMap: Record<(typeof liveAssetList)[number], Writable<number>> = {
	cattle: writable(5.6),
	chicken: writable(1.5)
};
