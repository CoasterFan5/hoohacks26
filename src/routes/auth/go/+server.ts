import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { resolve } from "$app/paths";
import { env } from "$env/dynamic/private";
import {z} from "zod"
import { db } from "$lib/server/db";
import { usersTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm/gel-core/expressions";
import { createSession } from "$lib/server/createSession";

const responseObject = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.int()
})

const userReqRespObject = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().optional()
})

export const GET: RequestHandler = async (event) => {
  const u = event.url
  const code = u.searchParams.get("code")

  const newU = new URL(`https://${env.AUTH0_DOMAIN}/oauth/token`)

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.AUTH0_CLIENT_ID,
    client_secret: env.AUTH0_CLIENT_SECRET,
    code: code!,
    redirect_uri: env.AUTH0_REDIRECT_URI
  })

  const f = await fetch(newU, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  })

  if (f.status != 200) {
    console.error(f)
    throw redirect(303, "/auth/login")
  }

  const respParsed = responseObject.safeParse(await f.json())

  if (respParsed.error) {
    console.error(respParsed.error)
    throw new Error("oop")
  }

  const userInfoReqUrl = new URL(`https://${env.AUTH0_DOMAIN}/userinfo`)
  const userInfoReq = await fetch(userInfoReqUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${respParsed.data.access_token}`
    }
  })

  if (userInfoReq.status != 200) {
    console.error(userInfoReq)
    throw new Error("Issue with user info network request.")
  }

  const userInfoReqJson = await userInfoReq.json()
  const userInfoReqParsed = userReqRespObject.safeParse(userInfoReqJson)

  if (userInfoReqParsed.error) {
    console.error(userInfoReqParsed.error)
    console.info(userInfoReqJson)
    throw new Error("Error parsing user details")
  }

  const userDetails = userInfoReqParsed.data

  const userCheck = await db.select().from(usersTable).where(eq(usersTable.id, userDetails.sub))

  if (userCheck.length > 0) {
    const userItem = userCheck[0]
    await createSession(userItem, {
      expires: respParsed.data.expires_in,
      token: respParsed.data.access_token
    }, event.cookies)
  } else {
    const newUser = await db.insert(usersTable).values({
      id: userDetails.sub,
      name: userDetails.name,
      email: userDetails.email,
      picture: userDetails.picture
    }).returning()

    const item = newUser[0]
    await createSession(item, {
      expires: respParsed.data.expires_in,
      token: respParsed.data.access_token
    }, event.cookies)


  }

  throw redirect(303, resolve("/(app)/app"))
}
