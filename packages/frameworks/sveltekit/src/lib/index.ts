import type { ServerLoadEvent } from '@sveltejs/kit';
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

const SKAuthHandler = async (
	{ request }: ServerLoadEvent,
	options: AuthOptions
): Promise<Response> => {
	options.secret ??= AUTH_SECRET;
	options.trustHost ??= !!(NEXTAUTH_URL ?? AUTH_TRUST_HOST ?? VERCEL ?? dev);

	return await AuthHandler(request, options);
};

/** The main entry point to next-auth-sveltekit */
function SvelteKitAuth(...args: [AuthOptions]): {
	GET: (event: ServerLoadEvent) => Promise<unknown>;
	POST: (event: ServerLoadEvent) => Promise<unknown>;
} {
	const options = args[0];
	return {
		GET: async (event) => await SKAuthHandler(event, options),
		POST: async (event) => {
			console.log('POST', event);
			await SKAuthHandler(event, options);
		}
	};
}

export default SvelteKitAuth;
