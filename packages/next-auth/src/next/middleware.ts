import type { NextMiddleware, NextFetchEvent } from "next/server"
import type { Awaitable, CookieOption, NextAuthOptions } from ".."
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
  pages?: NextAuthOptions["pages"]

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
      keyof Pick<keyof NextAuthOptions["cookies"], "sessionToken">,
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
     * // `pages/admin/_middleware.js`
     * import { withAuth } from "next-auth/middleware"
     *
     * export default withAuth({
     *   callbacks: {
     *     authorized: ({ token }) => token?.user.isAdmin
     *   }
     * })
     * ```
     *
     * ---
     * [Documentation](https://next-auth.js.org/getting-started/nextjs/middleware#api) | [`signIn` callback](configuration/callbacks#sign-in-callback)
     */
    authorized?: AuthorizedCallback
  }
}

async function handleMiddleware(
  req: NextRequest,
  options: NextAuthMiddlewareOptions | undefined,
  onSuccess?: (token: JWT | null) => Promise<any>
) {
  const signInPage = options?.pages?.signIn ?? "/api/auth/signin"
  const errorPage = options?.pages?.error ?? "/api/auth/error"
  const basePath = parseUrl(process.env.NEXTAUTH_URL).path
  // Avoid infinite redirect loop
  if (
    req.nextUrl.pathname.startsWith(basePath) ||
    [signInPage, errorPage].includes(req.nextUrl.pathname)
  ) {
    return
  }

  if (!process.env.NEXTAUTH_SECRET) {
    console.error(
      `[next-auth][error][NO_SECRET]`,
      `\nhttps://next-auth.js.org/errors#no_secret`
    )

    const errorUrl = new URL(errorPage, req.nextUrl.origin)
    errorUrl.searchParams.append("error", "Configuration")

    return NextResponse.redirect(errorUrl)
  }

  const token = await getToken({
    req,
    decode: options?.jwt?.decode,
    cookieName: options?.cookies?.sessionToken?.name,
  })

  const isAuthorized =
    (await options?.callbacks?.authorized?.({ req, token })) ?? !!token

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return await onSuccess?.(token)

  // the user is not logged in, redirect to the sign-in page
  const signInUrl = new URL(signInPage, req.nextUrl.origin)
  signInUrl.searchParams.append(
    "callbackUrl",
    `${req.nextUrl.pathname}${req.nextUrl.search}`
  )
  return NextResponse.redirect(signInUrl)
}

export type WithAuthArgs =
  | [NextRequest]
  | [NextRequest, NextFetchEvent]
  | [NextRequest, NextAuthMiddlewareOptions]
  | [NextMiddleware]
  | [NextMiddleware, NextAuthMiddlewareOptions]
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
 * // `pages/_middleware.js`
 * export { default } from "next-auth/middleware"
 * ```
 *
 * ---
 * [Documentation](https://next-auth.js.org/getting-started/middleware)
 */
export function withAuth(...args: WithAuthArgs) {
  if (!args.length || args[0] instanceof NextRequest) {
    // @ts-expect-error
    return handleMiddleware(...args)
  }

  if (typeof args[0] === "function") {
    const middleware = args[0]
    const options = args[1] as NextAuthMiddlewareOptions | undefined
    return async (...args: Parameters<NextMiddleware>) =>
      await handleMiddleware(args[0], options, async (token) => {
        ;(args[0] as any).nextauth = { token }
        return await middleware(...args)
      })
  }

  const options = args[0]
  return async (...args: Parameters<NextMiddleware>) =>
    await handleMiddleware(args[0], options)
}

export default withAuth
