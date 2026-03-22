import { liveAssetList, type LiveAssetType } from '$lib/liveAsset/liveAssetList';
import { livePriceMap } from '$lib/liveAsset/stores';
import { fromStore } from 'svelte/store';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	// make a map
	const m: Partial<Record<LiveAssetType, number>> = {};
	for (const item of liveAssetList) {
		const store = livePriceMap[item];
		m[item] = fromStore(store).current;
	}

	const resp = new Response(JSON.stringify(m));
	resp.headers.set('Content-type', 'application/json');

	return resp;
};
