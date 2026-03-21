import { command, getRequestEvent } from "$app/server";
import { z } from "zod";


export const remoteLogout = command(z.object({}), async () => {
  const { cookies } = getRequestEvent();
  cookies.delete("session", {
    path: "/"
  })
})
