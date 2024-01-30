/**
 *
 * :::warning
 * `@auth/astro` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * `@auth/astro` is the official Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core @auth/astro
 * ```
 *
 * @module @auth/astro
 */

// virtual module typedefs
import '../module'

import { Auth } from '@auth/core'
import type { AuthAction, AuthConfig, Session } from '@auth/core/types'
import { APIContext } from 'astro'
import authConfig from 'auth:config'
import { parseString } from 'set-cookie-parser'

export interface AstroAuthConfig extends AuthConfig {
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

function AstroAuthHandler(authOptions=authConfig) {
  const { basePath } = authOptions
  return async ({ request, cookies }: APIContext) => {
    const url = new URL(request.url)
    const action = url.pathname
      .slice(basePath.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(basePath + "/")) {
      return
    }

    const res = await Auth(request, authOptions)
    if (['callback', 'signin', 'signout'].includes(action)) {
			// Properly handle multiple Set-Cookie headers (they can't be concatenated in one)
			res.headers.getSetCookie().forEach((cookie) => {
				const { name, value, ...options } = parseString(cookie)
				// Astro's typings are more explicit than @types/set-cookie-parser for sameSite
				cookies.set(name, value, options as Parameters<(typeof cookies)['set']>[2])
			})
			res.headers.delete('Set-Cookie')
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
export function AstroAuth(options = authConfig) {
	// @ts-ignore
	const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env

	options.secret ??= AUTH_SECRET
	options.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? NODE_ENV !== 'production')

	const handler = AstroAuthHandler(options)
	return {
		async GET(context: APIContext) {
			return await handler(context)
		},
		async POST(context: APIContext) {
			return await handler(context)
		},
	}
}

/**
 * Fetches the current session.
 * @param req The request object.
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(req: Request, options = authConfig): Promise<Session | null> {
	// @ts-ignore
	options.secret ??= import.meta.env.AUTH_SECRET
	options.trustHost ??= true

	const url = new URL(`${options.basePath}/session`, req.url)
	const response = await Auth(new Request(url, { headers: req.headers }), options)
	const { status = 200 } = response

	const data = await response.json()

	if (!data || !Object.keys(data).length) return null
	if (status === 200) return data
	throw new Error(data.message)
}
