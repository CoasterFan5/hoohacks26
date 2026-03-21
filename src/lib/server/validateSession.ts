import type { Cookies } from "@sveltejs/kit"
import { db } from "./db"
import { sessionsTable, usersTable } from "./db/schema"
import { eq } from "drizzle-orm"

export const validateSession = async (cookies: Cookies) => {
  const ses = cookies.get("session")
  if (!ses) {
    console.error("No user session")
    return false
  }

  const sessionCheck = await db.select().from(sessionsTable).where(eq(sessionsTable.token, ses)).leftJoin(usersTable, eq(usersTable.id, sessionsTable.userId))

  if (sessionCheck.length < 1) {
        console.error("No session in db")
    return false
  }

  if (sessionCheck[0].sessions.expires < new Date()) {
    console.error("Session expired")
    return false
  }

  if (!sessionCheck[0].users) {
    console.error("no users with session")
    return false
  }
  return sessionCheck[0].users

}
