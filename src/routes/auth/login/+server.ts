import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_REDIRECT_URI } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const u = new URL(`https://${AUTH0_DOMAIN}/authorize`);
	u.searchParams.append(`client_id`, AUTH0_CLIENT_ID);
	u.searchParams.append(`redirect_uri`, AUTH0_REDIRECT_URI);
  u.searchParams.append(`response_type`, 'code');
	u.searchParams.append("scope", "openid profile email")
	throw redirect(303, u);
};
