/**
 * > **caution**
 * > `auth-astro` is currently experimental. Be aware of breaking changes between versions.
 *
 *
 * Astro Auth is the unofficial Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro site in a few lines of code.
 *
 * ## Installation
 *
 * `auth-astro` requires building your site in `server` mode with a platform adaper like `@astrojs/node`.
 * ```js
 * // astro.config.mjs
 * export default defineConfig({
 *   output: "server",
 *   adapter: node({
 *     mode: 'standalone'
 *   })
 * });
 * ```
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/core @auth/astro
 * ```
 */
import { Auth } from '@auth/core'
import type { AuthConfig, AuthAction, Session } from '@auth/core/types'
import { type Cookie, parseString, splitCookiesString } from 'set-cookie-parser'
import { serialize } from 'cookie'
import authConfig from 'auth:config'

const authOptions = authConfig as AstroAuthConfig

export interface AstroAuthConfig extends AuthConfig {
	/**
	 * Defines the base path for the auth routes.
	 * @default '/api/auth'
	 */
	prefix?: string
	/**
	 * Defineds wether or not you want the integration to handle the API routes
	 * @default true
	 */
	injectEndpoints?: boolean
}

const actions: AuthAction[] = [
	'providers',
	'session',
	'csrf',
	'signin',
	'signout',
	'callback',
	'verify-request',
	'error',
]

// solves the same issue that exists in @auth/solid-js
const getSetCookieCallback = (cook?: string | null): Cookie | undefined => {
	if (!cook) return
	const splitCookie = splitCookiesString(cook)
	for (const cookName of [
		'__Secure-next-auth.session-token',
		'next-auth.session-token',
		'next-auth.pkce.code_verifier',
		'__Secure-next-auth.pkce.code_verifier',
	]) {
		const temp = splitCookie.find(e => e.startsWith(`${cookName}=`))
		if (temp) {
			return parseString(temp)
		}
	}
	return parseString(splitCookie?.[0] ?? '') // just return the first cookie if no session token is found
}

function AstroAuthHandler(prefix: string, options = authOptions) {
	return async ({ request }: { request: Request }) => {
		const url = new URL(request.url)
		const action = url.pathname
			.slice(prefix.length + 1)
			.split('/')[0] as AuthAction

		if (!actions.includes(action) || !url.pathname.startsWith(prefix + '/'))
			return

		const res = await Auth(request, options)
		if (['callback', 'signin', 'signout'].includes(action)) {
			const parsedCookie = getSetCookieCallback(
				res.clone().headers.get('Set-Cookie')
			)
			if (parsedCookie) {
				res.headers.set(
					'Set-Cookie',
					serialize(parsedCookie.name, parsedCookie.value, parsedCookie as any)
				)
			}
		}
		return res
	}
}

/**
 * Creates a set of Astro endpoints for authentication.
 *
 * @example
 * ```ts
 * export const { GET, POST } = AstroAuth({
 *   providers: [
 *     GitHub({
 *       clientId: process.env.GITHUB_ID!,
 *       clientSecret: process.env.GITHUB_SECRET!,
 *     }),
 *   ],
 *   debug: false,
 * })
 * ```
 * @param config The configuration for authentication providers and other options.
 * @returns An object with `GET` and `POST` methods that can be exported in an Astro endpoint.
 */
export function AstroAuth(options = authOptions) {
	const { prefix = '/api/auth', ...authConfig } = options
	const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env

	authConfig.secret ??= AUTH_SECRET
	authConfig.trustHost ??= !!(
		AUTH_TRUST_HOST ??
		VERCEL ??
		NODE_ENV !== 'production'
	)

	const handler = AstroAuthHandler(prefix, options)
	return {
		async get(event: any) {
			return await handler(event)
		},
		async post(event: any) {
			return await handler(event)
		},
	}
}

/**
 * Fetches the current session.
 * @param req The request object.
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(
	req: Request,
	options = authOptions
): Promise<Session | null> {
	options.secret ??= import.meta.env.AUTH_SECRET
	options.trustHost ??= true

	const url = new URL(`${options.prefix}/session`, req.url)
	const response = await Auth(
		new Request(url, { headers: req.headers }),
		options
	)

	const { status = 200 } = response

	const data = await response.json()

	if (!data || !Object.keys(data).length) return null
	if (status === 200) return data
	throw new Error(data.message)
}
