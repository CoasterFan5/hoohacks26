import { db } from '$lib/server/db';
import { liveAssetsTable } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const assets = await db.select().from(liveAssetsTable);

	return {
		assets
	};
};
