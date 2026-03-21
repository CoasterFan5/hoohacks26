import type { LayoutServerLoad } from "./$types";
import {validateSession} from "$lib/server/validateSession"
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (params) => {
  const cookies = params.cookies

  const u = await validateSession(cookies)

  if (!u) {
    throw redirect(303, "/auth/login")
  } else {
    console.error("no user")
  }

  console.info("Validated!")

  return {
    user: u
  }

}
