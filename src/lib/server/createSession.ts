import type { Cookies } from "@sveltejs/kit";
import { db } from "./db";
import { sessionsTable, usersTable } from "./db/schema";

export const createSession = async (user: typeof usersTable.$inferSelect, auth0: {
  expires: number,
  token: string,
},
cookies: Cookies) => {
  const newSession = await db.insert(sessionsTable).values({
    userId: user.id,
    expires: new Date(Date.now() + auth0.expires * 999),
    auth0Token: auth0.token
  }).returning()

  cookies.set("session", newSession[0].token, {
    secure: false,
    sameSite: 'lax',
    path: '/',
    expires: newSession[0].expires
  })

  return newSession[0]

}
