import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { financeEntriesTable } from '$lib/server/db/schema';
import { handleAuth } from '$lib/server/handleAuth';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const getIncomeData = query(async () => {
	const u = await handleAuth();

	const financeEntries = await db
		.select()
		.from(financeEntriesTable)
		.where(and(eq(financeEntriesTable.userId, u.id), eq(financeEntriesTable.type, 'income')))
		.orderBy(desc(financeEntriesTable.createdAt));

	return financeEntries.map((entry) => ({
		id: entry.id,
		type: 'income' as const,
		category: entry.category,
		description: entry.description,
		amount: Number(entry.amount),
		date: entry.entryDate
	}));
});

export const saveIncome = command(
	z.object({
		category: z.string().min(1),
		description: z.string().min(1),
		amount: z.number().positive(),
		date: z.string().min(1)
	}),
	async (params) => {
		const u = await handleAuth();

		await db.insert(financeEntriesTable).values({
			userId: u.id,
			type: 'income',
			category: params.category,
			description: params.description,
			amount: params.amount.toFixed(2),
			entryDate: params.date
		});
	}
);
