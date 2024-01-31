// virtual module typedefs
import '../module.d.ts'

import { Auth } from '@auth/core'
import type { AuthAction, Session } from '@auth/core/types'
import { APIContext } from 'astro'
import authConfig from 'auth:config'
import { parseString } from 'set-cookie-parser'

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

function AstroAuthHandler(config?: ReturnType<typeof authConfig>) {
  return async (ctx: APIContext) => {
    // @ts-expect-error .env isn't detected by ts
    const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env
    config ??= authConfig(ctx)
    const { basePath } = config
    config.secret ??= AUTH_SECRET
    config.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? NODE_ENV !== 'production')

    const { request, cookies } = ctx
    const url = new URL(request.url)
    const action = url.pathname
      .slice(basePath.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(basePath + "/")) {
      return
    }

    const res = await Auth(request, config) as Response
    if (['callback', 'signin', 'signout'].includes(action)) {
			// Properly handle multiple Set-Cookie headers (they can't be concatenated in one)
			res.headers.getSetCookie().forEach((cookie: string) => {
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
 * 
 * @param config The configuration for authentication providers and other options. Providing this will override your auth config file.
 * @returns An object with `GET` and `POST` methods that can be exported in an Astro endpoint.
 */
export function AstroAuth(config?: ReturnType<typeof authConfig>) {
	const handler = AstroAuthHandler(config)
	return {
		GET: handler,
		POST: handler,
	}
}

/**
 * Fetches the current session.
 * @param req The request object.
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(ctx: APIContext, config?: ReturnType<typeof authConfig>): Promise<Session | null> {
  config ??= authConfig(ctx)
	// @ts-ignore
	config.secret ??= import.meta.env.AUTH_SECRET
	config.trustHost ??= true

	const url = new URL(`${config.basePath}/session`, ctx.request.url)
	const response = await Auth(new Request(url, { headers: ctx.request.headers }), config) as Response
	const { status = 200 } = response

	const data = await response.json()

	if (!data || !Object.keys(data).length) return null
	if (status === 200) return data
	throw new Error(data.message)
}
