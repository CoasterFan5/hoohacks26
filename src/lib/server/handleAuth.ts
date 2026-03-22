import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { validateSession } from './validateSession';

export const handleAuth = async () => {
	const event = getRequestEvent();
	const u = await validateSession(event.cookies);
	if (!u) {
		throw redirect(303, '/auth/login');
	}
	return u;
};
