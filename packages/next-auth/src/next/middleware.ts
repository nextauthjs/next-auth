import type { NextMiddleware, NextFetchEvent } from "next/server"
import type { Awaitable, CookieOption, AuthOptions } from ".."
import type { JWT, JWTOptions } from "../jwt"

import { NextResponse, NextRequest } from "next/server"

import { getToken } from "../jwt"
import parseUrl from "../utils/parse-url"

type AuthorizedCallback = (params: {
  token: JWT | null
  req: NextRequest
}) => Awaitable<boolean>

export interface NextAuthMiddlewareOptions {
  /**
   * Where to redirect the user in case of an error if they weren't logged in.
   * Similar to `pages` in `NextAuth`.
   *
   * ---
   * [Documentation](https://next-auth.js.org/configuration/pages)
   */
  pages?: AuthOptions["pages"]

  /**
   * You can override the default cookie names and options for any of the cookies
   * by this middleware. Similar to `cookies` in `NextAuth`.
   *
   * Useful if the token is stored in not a default cookie.
   *
   * ---
   * [Documentation](https://next-auth.js.org/configuration/options#cookies)
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   */
  cookies?: Partial<
    Record<
      keyof Pick<keyof AuthOptions["cookies"], "sessionToken">,
      Omit<CookieOption, "options">
    >
  >

  /**
   * If a custom jwt `decode` method is set in `[...nextauth].ts`, the same method should be set here also.
   *
   * ---
   * [Documentation](https://next-auth.js.org/configuration/nextjs#custom-jwt-decode-method)
   */
  jwt?: Partial<Pick<JWTOptions, "decode">>

  callbacks?: {
    /**
     * Callback that receives the user's JWT payload
     * and returns `true` to allow the user to continue.
     *
     * This is similar to the `signIn` callback in `NextAuthOptions`.
     *
     * If it returns `false`, the user is redirected to the sign-in page instead
     *
     * The default is to let the user continue if they have a valid JWT (basic authentication).
     *
     * How to restrict a page and all of it's subpages for admins-only:
     * @example
     *
     * ```js
     * // `middleware.js`
     * import { withAuth } from "next-auth/middleware"
     *
     * export default withAuth({
     *   callbacks: {
     *     authorized: ({ token }) => token?.user.isAdmin
     *   }
     * })
     *
     * export const config = { matcher: ["/admin"] }
     *
     * ```
     *
     * ---
     * [Documentation](https://next-auth.js.org/configuration/nextjs#middleware) | [`signIn` callback](configuration/callbacks#sign-in-callback)
     */
    authorized?: AuthorizedCallback
  }

  /**
   * The same `secret` used in the `NextAuth` configuration.
   * Defaults to the `NEXTAUTH_SECRET` environment variable.
   */
  secret?: string
}

// TODO: `NextMiddleware` should allow returning `void`
// Simplify when https://github.com/vercel/next.js/pull/38625 is merged.
type NextMiddlewareResult = ReturnType<NextMiddleware> | void // eslint-disable-line @typescript-eslint/no-invalid-void-type

async function handleMiddleware(
  req: NextRequest,
  options: NextAuthMiddlewareOptions | undefined,
  onSuccess?: (token: JWT | null) => Promise<NextMiddlewareResult>
) {
  const { pathname, search, origin, basePath } = req.nextUrl

  const signInPage = options?.pages?.signIn ?? "/api/auth/signin"
  const errorPage = options?.pages?.error ?? "/api/auth/error"
  const authPath = parseUrl(process.env.NEXTAUTH_URL).path
  const publicPaths = ["/_next", "/favicon.ico"]

  // Avoid infinite redirects/invalid response
  // on paths that never require authentication
  if (
    `${basePath}${pathname}`.startsWith(authPath) ||
    [signInPage, errorPage].includes(pathname) ||
    publicPaths.some((p) => pathname.startsWith(p))
  ) {
    return
  }

  const secret =
    options?.secret ?? process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
  if (!secret) {
    console.error(
      `[next-auth][error][NO_SECRET]`,
      `\nhttps://next-auth.js.org/errors#no_secret`
    )

    const errorUrl = new URL(`${basePath}${errorPage}`, origin)
    errorUrl.searchParams.append("error", "Configuration")

    return NextResponse.redirect(errorUrl)
  }

  const token = await getToken({
    req,
    decode: options?.jwt?.decode,
    cookieName: options?.cookies?.sessionToken?.name,
    secret,
  })

  const isAuthorized =
    (await options?.callbacks?.authorized?.({ req, token })) ?? !!token

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return await onSuccess?.(token)

  // the user is not logged in, redirect to the sign-in page
  const signInUrl = new URL(`${basePath}${signInPage}`, origin)
  signInUrl.searchParams.append(
    "callbackUrl",
    `${basePath}${pathname}${search}`
  )
  return NextResponse.redirect(signInUrl)
}

export interface NextRequestWithAuth extends NextRequest {
  nextauth: { token: JWT | null }
}

export type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent
) => NextMiddlewareResult | Promise<NextMiddlewareResult>

export type WithAuthArgs =
  | [NextRequestWithAuth]
  | [NextRequestWithAuth, NextFetchEvent]
  | [NextRequestWithAuth, NextAuthMiddlewareOptions]
  | [NextMiddlewareWithAuth]
  | [NextMiddlewareWithAuth, NextAuthMiddlewareOptions]
  | [NextAuthMiddlewareOptions]
  | []

/**
 * Middleware that checks if the user is authenticated/authorized.
 * If if they aren't, they will be redirected to the login page.
 * Otherwise, continue.
 *
 * @example
 *
 * ```js
 * // `middleware.js`
 * export { default } from "next-auth/middleware"
 * ```
 *
 * ---
 * [Documentation](https://next-auth.js.org/configuration/nextjs#middleware)
 */

export function withAuth(): ReturnType<NextMiddlewareWithAuth>

export function withAuth(
  req: NextRequestWithAuth
): ReturnType<NextMiddlewareWithAuth>

export function withAuth(
  req: NextRequestWithAuth,
  event: NextFetchEvent
): ReturnType<NextMiddlewareWithAuth>

export function withAuth(
  req: NextRequestWithAuth,
  options: NextAuthMiddlewareOptions
): ReturnType<NextMiddlewareWithAuth>

export function withAuth(
  middleware: NextMiddlewareWithAuth,
  options: NextAuthMiddlewareOptions
): NextMiddlewareWithAuth

export function withAuth(
  middleware: NextMiddlewareWithAuth
): NextMiddlewareWithAuth

export function withAuth(
  options: NextAuthMiddlewareOptions
): NextMiddlewareWithAuth

export function withAuth(
  ...args: WithAuthArgs
): ReturnType<NextMiddlewareWithAuth> | NextMiddlewareWithAuth {
  if (!args.length || args[0] instanceof Request) {
    // @ts-expect-error
    return handleMiddleware(...args)
  }

  if (typeof args[0] === "function") {
    const middleware = args[0]
    const options = args[1] as NextAuthMiddlewareOptions | undefined
    return async (...args: Parameters<NextMiddlewareWithAuth>) =>
      await handleMiddleware(args[0], options, async (token) => {
        args[0].nextauth = { token }
        return await middleware(...args)
      })
  }

  const options = args[0]
  return async (...args: Parameters<NextMiddleware>) =>
    await handleMiddleware(args[0], options)
}

export default withAuth
