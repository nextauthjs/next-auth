import type { NextMiddleware, NextFetchEvent } from "next/server"
import type { Awaitable, NextAuthOptions } from ".."
import type { JWT } from "../jwt"

import { NextResponse, NextRequest } from "next/server"

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
  authorized?: (options: {
    token: JWT | null
    req: NextRequest
  }) => Awaitable<boolean>
}

export type WithAuthArgs =
  | [NextRequest]
  | [NextRequest, NextFetchEvent]
  | [NextRequest, NextAuthMiddlewareOptions]
  | [NextMiddleware]
  | [NextMiddleware, NextAuthMiddlewareOptions]
  | [NextAuthMiddlewareOptions]

/** Check if `secret` has been declared  */
function initConfig(
  req: NextRequest,
  options?: NextAuthMiddlewareOptions | NextFetchEvent
) {
  // @ts-expect-error
  const signInPage = options?.pages?.signIn ?? "/api/auth/signin"
  // @ts-expect-error
  const errorPage = options?.pages?.error ?? "/api/auth/error"

  // Avoid infinite redirect loop
  if ([signInPage, errorPage].includes(req.nextUrl.pathname)) return

  // @ts-expect-error
  const secret = options?.secret ?? process.env.NEXTAUTH_SECRET
  // Continue only if the secret is specified
  if (secret)
    return {
      req,
      options,
      secret,
      signInPage,
      // @ts-expect-error
      authorized: options?.authorized || (({ token }) => token),
    }

  console.error(
    `[next-auth][error][NO_SECRET]`,
    `\nhttps://next-auth.js.org/errors#no_secret`
  )

  return {
    redirect: NextResponse.redirect(`${errorPage}?error=Configuration`),
  }
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
 * export { default } from "next-auth/middleware"
 * ```
 *
 * ---
 * [Documentation](https://next-auth.js.org/getting-started/middleware)
 */
export function withAuth(...args: WithAuthArgs) {
  if (args[0] instanceof NextRequest) {
    const config = initConfig(args[0], args[1])
    if (!config || config.redirect) return config?.redirect
    const { req, secret, signInPage, authorized } = config

    return getToken({ req: req as any, secret }).then(async (token) => {
      if (await authorized({ req, token })) return

      return NextResponse.redirect(
        `${signInPage}?${new URLSearchParams({ callbackUrl: req.url })}`
      )
    })
  }

  if (typeof args[0] === "function") {
    const middleware = args[0]
    const options = args[1] as NextAuthMiddlewareOptions | undefined
    return async (...args: Parameters<NextMiddleware>) => {
      const config = initConfig(args[0], options)
      if (!config || config.redirect) return config?.redirect
      const { req, secret, signInPage, authorized } = config

      const token = await getToken({ req: req as any, secret })

      if (await authorized({ req, token })) {
        ;(args[0] as any).token = token
        return await middleware(...args)
      }

      return NextResponse.redirect(
        `${signInPage}?${new URLSearchParams({ callbackUrl: req.url })}`
      )
    }
  }

  const options = args[0]
  return async (...args: Parameters<NextMiddleware>) => {
    const config = initConfig(args[0], options)
    if (!config || config.redirect) return config?.redirect

    const { req, secret, signInPage, authorized } = config

    const token = await getToken({ req: req as any, secret })

    if (await authorized({ req, token })) return

    return NextResponse.redirect(
      `${signInPage}?${new URLSearchParams({ callbackUrl: req.url })}`
    )
  }
}

export default withAuth
