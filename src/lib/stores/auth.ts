import { writable, derived, get, type Readable } from 'svelte/store';
import { createAuth0Client, type Auth0Client, type User } from '@auth0/auth0-spa-js';
import { browser } from '$app/environment';

export const auth0Client = writable<Auth0Client | null>(null);
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isLoading = writable<boolean>(true);
export const error = writable<string | null>(null);

// Derived stores
export const isLoggedIn: Readable<boolean> = derived(
	[isAuthenticated, isLoading],
	([$isAuthenticated, $isLoading]) => $isAuthenticated && !$isLoading
);

let initPromise: Promise<void> | null = null;

export async function initializeAuth() {
	if (!browser) return;

	// Prevent multiple simultaneous initializations
	if (initPromise) return initPromise;

	initPromise = (async () => {
		try {
			const domain = import.meta.env.VITE_AUTH0_DOMAIN;
			const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

			// Validate environment variables
			if (!domain || !clientId) {
				throw new Error(
					'Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your .env file.'
				);
			}

			const client = await createAuth0Client({
				domain,
				clientId,
				authorizationParams: {
					redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/` : ''
				},
				useRefreshTokens: true,
				cacheLocation: 'localstorage'
			});

			auth0Client.set(client);

			// Handle OAuth callback
			if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
				try {
					console.log('Handling redirect callback with URL:', window.location.href);
					const result = await client.handleRedirectCallback();
					console.log('Callback handled successfully:', result);
					// Clean up URL
					window.history.replaceState({}, document.title, window.location.pathname);
				} catch (callbackError) {
					console.error('Error handling redirect callback:', callbackError);

					// Check for specific error types
					if (callbackError instanceof Error) {
						if (callbackError.message.includes('Unauthorized')) {
							error.set(
								'Authentication failed: Unauthorized. Please check:\n' +
									'1. Allowed Callback URLs in Auth0 includes: ' +
									window.location.origin +
									'/\n' +
									'2. Application Type is set to "Single Page Application"\n' +
									'3. Allowed Web Origins includes: ' +
									window.location.origin
							);
						} else if (callbackError.message.includes('state')) {
							error.set('Invalid state parameter. Please clear your browser cache and try again.');
						} else {
							error.set(`Authentication callback failed: ${callbackError.message}`);
						}
					} else {
						error.set('Authentication callback failed. Please try logging in again.');
					}

					// Clean up URL even on error
					window.history.replaceState({}, document.title, window.location.pathname);
				}
			}

			// Check authentication status
			const authenticated = await client.isAuthenticated();
			isAuthenticated.set(authenticated);

			if (authenticated) {
				const userData = await client.getUser();
				user.set(userData || null);
			}
		} catch (err) {
			console.error('Auth initialization error:', err);
			error.set(err instanceof Error ? err.message : 'Authentication initialization failed');
		} finally {
			isLoading.set(false);
		}
	})();

	return initPromise;
}

export async function login() {
	const client = get(auth0Client);
	if (!client) {
		console.error('Auth0 client not initialized');
		return;
	}

	try {
		await client.loginWithRedirect({
			authorizationParams: {
				redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/` : ''
			}
		});
	} catch (err) {
		console.error('Login error:', err);
		error.set(err instanceof Error ? err.message : 'Login failed');
	}
}

export async function logout() {
	const client = get(auth0Client);
	if (!client) {
		console.error('Auth0 client not initialized');
		return;
	}

	try {
		await client.logout({
			logoutParams: {
				returnTo: typeof window !== 'undefined' ? `${window.location.origin}/` : ''
			}
		});

		// Clear local state
		user.set(null);
		isAuthenticated.set(false);
	} catch (err) {
		console.error('Logout error:', err);
		error.set(err instanceof Error ? err.message : 'Logout failed');
	}
}

export async function getToken(): Promise<string | null> {
	const client = get(auth0Client);
	if (!client) return null;

	try {
		return await client.getTokenSilently();
	} catch (e: unknown) {
		if (e && typeof e === 'object' && 'error' in e && e.error === 'login_required') {
			await login();
		}
		return null;
	}
}
