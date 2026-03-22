import { query } from '$app/server';
import { db } from '$lib/server/db';
import { financeEntriesTable } from '$lib/server/db/schema';
import { handleAuth } from '$lib/server/handleAuth';
import { desc, eq } from 'drizzle-orm';

export const getFinanceOverview = query(async () => {
	const u = await handleAuth();

	const financeEntries = await db
		.select()
		.from(financeEntriesTable)
		.where(eq(financeEntriesTable.userId, u.id))
		.orderBy(desc(financeEntriesTable.createdAt));

	return {
		incomeEntries: financeEntries
			.filter((entry) => entry.type === 'income')
			.map((entry) => ({
				id: entry.id,
				type: 'income' as const,
				category: entry.category,
				description: entry.description,
				amount: Number(entry.amount),
				date: entry.entryDate
			})),

		expenseEntries: financeEntries
			.filter((entry) => entry.type === 'expense')
			.map((entry) => ({
				id: entry.id,
				type: 'expense' as const,
				category: entry.category,
				description: entry.description,
				amount: Number(entry.amount),
				date: entry.entryDate
			}))
	};
});
