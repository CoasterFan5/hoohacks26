import { pgTable, text, timestamp, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

const newId = () => {
  return createId();
};

export const usersTable = pgTable("users", {
  id: text().notNull().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  picture: text()
});

export const sessionsTable = pgTable("sessions", {
  token: text().notNull().primaryKey().$defaultFn(newId),
  userId: text().notNull().references(() => usersTable.id, {
    onDelete: "cascade"
  }),
  auth0Token: text().notNull(),
  expires: timestamp().notNull()
});

export const assetCategoryEnum = pgEnum("asset_category", [
  "vehicles",
  "machinery",
  "buildings",
  "infrastructure",
  "equipment",
  "tools"
]);

export const assetConditionEnum = pgEnum("asset_condition", [
  "excellent",
  "good",
  "fair",
  "poor"
]);

export const ranchAssetsTable = pgTable("ranch_assets", {
  id: text().notNull().primaryKey().$defaultFn(newId),

  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade"
    }),

  name: text().notNull(),

  category: assetCategoryEnum().notNull(),

  quantity: integer().notNull(),

  purchasePrice: numeric({ precision: 12, scale: 2 }).notNull(),

  currentUnitValue: numeric({ precision: 12, scale: 2 }).notNull(),

  purchaseYear: integer().notNull(),

  condition: assetConditionEnum().notNull(),

  lastUpdated: timestamp().notNull().defaultNow()
});

export const financeEntryTypeEnum = pgEnum("finance_entry_type", [
  "income",
  "expense"
]);

export const financeEntriesTable = pgTable("finance_entries", {
  id: text().notNull().primaryKey().$defaultFn(newId),

  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade"
    }),

  type: financeEntryTypeEnum().notNull(),

  category: text().notNull(),

  description: text().notNull(),

  amount: numeric({ precision: 12, scale: 2 }).notNull(),

  entryDate: text().notNull(),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});

export const herdGroupsTable = pgTable("herd_groups", {
  id: text().notNull().primaryKey().$defaultFn(newId),

  userId: text()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade"
    }),

  breed: text().notNull(),

  count: integer().notNull(),

  avgWeightLbs: numeric({ precision: 10, scale: 2 }).notNull(),

  pricePerCwt: numeric({ precision: 10, scale: 2 }).notNull(),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow()
});