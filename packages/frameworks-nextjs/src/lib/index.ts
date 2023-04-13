import { Auth, type AuthConfig } from "@auth/core"
import { NextResponse } from "next/server"

import type { JWT } from "@auth/core/jwt"
import type { Awaitable, User } from "@auth/core/types"
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"

export interface NextAuthConfig extends AuthConfig {
  callbacks: AuthConfig["callbacks"] & {
    /**
     * Invoked when a user needs authorization. It uses Middleware to
     * intercept requests.
     *
     * By default, it checks if the user is logged in, if not, it redirects
     * to the login page.
     *
     * You can override this behavior by returning a {@link NextResponse}
     *
     * @example
     * ```ts title="app/auth.ts"
     * ...
     * async authorized({ request, auth }) {
     *   const url = new URL(request.url)
     *
     *   if(request.method === "POST") {
     *     const { authToken } = (await request.json()) ?? {}
     *     // If the request has a valid auth token, it is authorized
     *     const valid = await validateAuthToken(authToken)
     *     if(valid) return true
     *     return NextResponse.json("Invalid auth token", { status: 401 })
     *   }
     *
     *   // Logged in users are authorized, otherwise, will redirect to login
     *   return !!auth
     * }
     * ...
     * ```
     */
    authorized: (params: {
      request: NextRequest
      auth: JWT | User | null
      expires: string | null
    }) => Awaitable<boolean | NextResponse>
  }
}

async function getAuth(
  headers: Headers,
  config: NextAuthConfig
): Promise<{ expires: string; data: AuthData } | null> {
  // TODO: Handle URL correctly (NEXTAUTH_URL, request host, protocol, custom path, etc.)
  const req = new Request("http://n/api/auth/session", {
    headers: { cookie: headers.get("cookie") ?? "" },
  })
  config.trustHost = true
  if (config.callbacks) {
    config.callbacks.session ??= ({ session, user, token }) => ({
      expires: session.expires,
      auth: user ?? token,
    })
  }
  const response = await Auth(req, config)
  return response.json()
}

export interface NextRequestWithAuth extends NextRequest {
  auth: JWT | User | null
}

type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent
) => ReturnType<NextMiddleware>

type WithAuthArgs =
  | [NextRequestWithAuth, NextFetchEvent]
  | [NextMiddlewareWithAuth]
  | [Headers]
  | []

export function initAuth(config: NextAuthConfig) {
  return (...args: WithAuthArgs) => {
    // TODO: use `next/headers` when it's available in Middleware too
    // if (!args.length) return getAuth($headers(), config)
    console.log(args[0])
    if (!args.length) return getAuth(new Headers(), config)
    if (args[0] instanceof Headers) return getAuth(args[0], config)
    if (args[0] instanceof Request) {
      const req = args[0]
      // export { auth as default } from "auth"
      return authMiddleware(req, config)
    }

    // import { auth } from "auth"
    // export default auth((req) => { console.log(req.auth) }})
    const userMiddleware = args[0]
    return async (...args: Parameters<NextMiddlewareWithAuth>) => {
      return authMiddleware(args[0], config, async (auth, exp) => {
        args[0].auth = auth
        // Execute user middleware with augmented request
        const userResponse = (await userMiddleware(...args)) ?? undefined

        // Augment response with updated session cookie
        const response = new NextResponse(userResponse?.body, userResponse)
        // TODO: respect config/prefix/chunking etc.
        const name = "next-auth.session-token"
        const val = args[0].cookies.get(name)?.value
        // TODO: respect config/prefix/chunking etc.
        if (val) response.cookies.set(name, val, { expires: new Date(exp!) })

        return response
      })
    }
  }
}

type AuthData = JWT | User | null

async function authMiddleware(
  req: NextRequest,
  config: NextAuthConfig,
  onSuccess?: (
    auth: AuthData,
    expires: string | null
  ) => ReturnType<NextMiddleware> | AuthData
) {
  const request = req
  // TODO: pass `next/headers` when it's available
  const { data: auth = null, expires = null } =
    (await getAuth(request.headers, config)) ?? {}

  const authorized =
    (await config.callbacks?.authorized?.({
      request,
      auth,
      expires,
    })) ?? !!auth

  if (authorized instanceof Response) return authorized
  else if (authorized) return onSuccess?.(auth, expires)
  else if (onSuccess) return onSuccess(auth, expires)
  // TODO: Support custom signin page
  req.nextUrl.pathname = "/api/auth/signin"
  return NextResponse.redirect(req.nextUrl)
}
