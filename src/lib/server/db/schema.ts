import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { liveAssetList } from '$lib/liveAsset/liveAssetList';

const liveAssetEnum = pgEnum('text', liveAssetList);

const newId = () => {
	return createId();
};

export const usersTable = pgTable('users', {
	id: text().notNull().primaryKey(),
	name: text().notNull(),
	email: text().notNull(),
	picture: text()
});

export const sessionsTable = pgTable('sessions', {
	token: text().notNull().primaryKey().$defaultFn(newId),
	userId: text()
		.notNull()
		.references(() => usersTable.id, {
			onDelete: 'cascade'
		}),
	auth0Token: text().notNull(),
	expires: timestamp().notNull()
});

export const liveAssetsTable = pgTable('liveAssets', {
	id: text().notNull().primaryKey().$defaultFn(newId),
	owner: text()
		.notNull()
		.references(() => usersTable.id),
	created: timestamp()
		.notNull()
		.$defaultFn(() => new Date()),
	mass: integer().notNull().default(0),
	name: text().notNull(),
	type: liveAssetEnum().notNull(),
	externalId: text()
});

export const assetCategoryTable = pgTable('assetCategory', {
	id: text().notNull().primaryKey().$defaultFn(newId),
	owner: text()
		.notNull()
		.references(() => usersTable.id),
	name: text().notNull()
});

export const assetsTable = pgTable('assetsTable', {
	id: text().notNull().primaryKey().$defaultFn(newId),
	owner: text()
		.notNull()
		.references(() => usersTable.id),
	created: timestamp()
		.notNull()
		.$defaultFn(() => new Date()),
	valuation: integer().notNull(),
	name: text().notNull(),
	categoryId: text()
		.notNull()
		.references(() => assetCategoryTable.id, {
			onDelete: 'cascade'
		})
});
