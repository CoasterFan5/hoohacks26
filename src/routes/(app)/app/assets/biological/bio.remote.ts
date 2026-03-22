import { command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { liveAssetsTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import z from 'zod';

export const createItem = command(
	z.object({
		name: z.string(),
		mass: z.number()
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
			type: 'cattle'
		});
	}
);
