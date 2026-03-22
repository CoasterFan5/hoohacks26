import { command, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import { liveAssetsTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { liveAssetList } from '$lib/liveAsset/liveAssetList';

export const addBioAsset = command(
	z.object({
		name: z.string(),
		mass: z.number(),
		type: z.enum(liveAssetList)
	}),
	async (params) => {
		const r = getRequestEvent();
		const user = await validateSession(r.cookies);
		if (!user) {
			throw new Error('Invalid Session');
		}

		await db.insert(liveAssetsTable).values({
			owner: user.id,
			mass: params.mass,
			name: params.name,
			type: params.type
		});
	}
);

export const getBioAssets = query(async () => {
	const event = getRequestEvent();
	const u = await validateSession(event.cookies);

	if (!u) {
		throw redirect(303, '/auth/login');
	}

	const assets = await db.select().from(liveAssetsTable).where(eq(liveAssetsTable.owner, u.id));

	return {
		assets
	};
});
