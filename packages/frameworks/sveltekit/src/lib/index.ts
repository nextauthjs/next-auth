import type { Handle } from '@sveltejs/kit';
import { AUTH_SECRET, NEXTAUTH_URL, AUTH_TRUST_HOST, VERCEL } from '$env/static/private';
import { dev } from '$app/environment';

import { AuthHandler, type AuthOptions } from 'next-auth-core';

export const getServerSession = async (req: Request, options: AuthOptions): Promise<unknown> => {
	options.secret ??= AUTH_SECRET;
	options.trustHost ??= true;

	const url = new URL('/api/auth/session', req.url);
	const response = await AuthHandler(new Request(url, { headers: req.headers }), options);

	const { status = 200 } = response;

	const data = await response.json();

	if (!data || !Object.keys(data).length) return null;

	if (status === 200) {
		return data;
	}
	throw new Error(data.message);
};

interface SvelteKitAuthOptions extends AuthOptions {
	/**
	 * @default '/auth'
	 */
	prefix?: string;
}
const actions = [ "providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "_log" ]

/** The main entry point to next-auth-sveltekit */
function SvelteKitAuth({prefix = '/auth', ...options }: SvelteKitAuthOptions) {

	options.secret ??= AUTH_SECRET;
	options.trustHost ??= !!(NEXTAUTH_URL ?? AUTH_TRUST_HOST ?? VERCEL ?? dev);

	return (({ event, resolve }) => {
		const [action] = event.url.pathname.slice(prefix.length + 1).split('/');
		const isAuth = actions.includes(action)
		event.locals.getSession = async () => {
			const session = getServerSession(event.request, options)
			return session
		};
    if (!event.url.pathname.startsWith(prefix + '/') || !isAuth) {
			return resolve(event)
		}
		event.locals.getSession = async () => {
			const session = getServerSession(event.request, options)
			return session
		};
		return AuthHandler(event.request, options);
  }) satisfies Handle
}

export default SvelteKitAuth;
