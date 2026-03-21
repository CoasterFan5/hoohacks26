import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

const newId = () => {
  return createId()
}

export const usersTable = pgTable("users", {
  id: text().notNull().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  picture: text()
})

export const sessionsTable = pgTable('sessions', {
  token: text().notNull().primaryKey().$defaultFn(newId),
  userId: text().notNull().references(() => usersTable.id, {
    onDelete: "cascade"
  }),
  auth0Token: text().notNull(),
  expires: timestamp().notNull()
})
