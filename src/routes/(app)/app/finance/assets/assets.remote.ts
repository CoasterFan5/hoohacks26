import { command, getRequestEvent, query } from '$app/server';
import { db } from '$lib/server/db';
import { assetCategoryTable, assetsTable } from '$lib/server/db/schema';
import { validateSession } from '$lib/server/validateSession';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const handleAuth = async () => {
	const event = getRequestEvent();
	const u = await validateSession(event.cookies);
	if (!u) {
		throw redirect(303, '/auth/login');
	}
	return u;
};

export const getAssets = query(async () => {
	const u = await handleAuth();

	const assets = await db.select().from(assetsTable).where(eq(assetsTable.owner, u.id));

	return assets;
});

export const createAsset = command(
	z.object({
		name: z.string(),
		value: z.number(),
		categoryId: z.string()
	}),
	async (params) => {
		const u = await handleAuth();

		await db.insert(assetsTable).values({
			owner: u.id,
			name: params.name,
			valuation: params.value,
			categoryId: params.categoryId
		});
	}
);

export const getCategories = query(async () => {
	const u = await handleAuth();

	const categories = await db
		.select()
		.from(assetCategoryTable)
		.where(eq(assetCategoryTable.owner, u.id));

	return categories;
});

export const createCategory = command(
	z.object({
		name: z.string()
	}),
	async (params) => {
		const u = await handleAuth();

		const newCategory = await db
			.insert(assetCategoryTable)
			.values({
				name: params.name,
				owner: u.id
			})
			.returning();

		await getCategories().refresh();

		return newCategory[0];
	}
);
