import type { NextMiddleware, NextFetchEvent } from "next/server"
import type { Awaitable, NextAuthOptions } from ".."
import type { JWT } from "../jwt"

import { NextResponse, NextRequest } from "next/server"

import { getToken } from "../jwt"
import parseUrl from "../lib/parse-url"

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

  const token = await getToken({ req })

  const isAuthorized =
    (await options?.callbacks?.authorized?.({ req, token })) ?? !!token

  // the user is authorized, let the middleware handle the rest
  if (isAuthorized) return await onSuccess?.(token)

  // the user is not logged in, redirect to the sign-in page
  const signInUrl = new URL(signInPage, req.nextUrl.origin)
  signInUrl.searchParams.append("callbackUrl", req.url)
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
