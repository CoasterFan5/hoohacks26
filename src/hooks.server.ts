import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/validateSession';

export const handle: Handle = async ({ event, resolve }) => {
  const user = await validateSession(event.cookies);
  if (user) {
    event.locals.user = user;
  }
  return resolve(event);
};