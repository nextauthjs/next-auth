import type { NextRequest } from "next/server"
import type { Awaitable, NextAuthOptions } from ".."
import type { JWT } from "../jwt"

import { NextResponse } from "next/server"
import { getToken } from "../jwt"

export interface NextAuthMiddlewareOptions {
  /**
   * The secret used to create the session.
   * @note Must match as `secret` in `NextAuth`.
   * @default process.env.NEXTAUTH_SECRET
   *
   * ---
   * [Documentation](https://next-auth.js.org/configuration/options#secret)
   */
  secret?: string
  /**
   * Where to redirect the user in case of an error if they weren't logged in.
   * Similar to `pages` in `NextAuth`.
   *
   * ---
   * [Documentation](https://next-auth.js.org/configuration/pages)
   */
  pages?: NextAuthOptions["pages"]
  /**
   * Callback that receives the user's JWT payload
   * and returns `true` to allow the user to continue.
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
   * import { withAuth } from "next-auth/next/middleware"
   *
   * export default withAuth({
   *   authorized: ({ token }) => token?.user.isAdmin
   * })
   * ```
   */
  authorized: (options: {
    token: JWT | null
    req: NextRequest
  }) => Awaitable<boolean>
}

/**
 * Middleware that checks if the user is authenticated/authorized.
 * If if they aren't, they will be redirected to the login page.
 * Otherwise, continue.
 *
 * @example
 *
 * ```js
 * // `pages/_middleware.js`
 * export { withAuth as default } from "next-auth/next/middleware"
 * ```
 *
 * ---
 * [Documentation](https://next-auth.js.org/getting-started/middleware)
 */
export function withAuth(options?: NextAuthMiddlewareOptions) {
  const secret = options?.secret ?? process.env.NEXTAUTH_SECRET
  if (!secret) {
    const code = "NO_SECRET"
    console.error(
      `[next-auth][error][${code}]`,
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`
    )
    return NextResponse.redirect(
      options?.pages?.error ?? "/api/auth/error?error=Configuration"
    )
  }

  return async function middleware(req: NextRequest) {
    const token = await getToken({
      req: {
        headers: req.headers as any,
        cookies: req.cookies,
      },
      secret,
    })

    const isAuthorized = options?.authorized
      ? options?.authorized?.({ token, req })
      : !!token

    if (isAuthorized) return

    return NextResponse.redirect(options?.pages?.signIn ?? "/api/auth/signin")
  }
}
