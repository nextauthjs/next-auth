import { Auth, type AuthConfig } from "@auth/core"
import { NextResponse } from "next/server"

import type { JWT } from "@auth/core/jwt"
import type { Awaitable, CallbacksOptions, User } from "@auth/core/types"
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"

export interface NextAuthCallbacks extends Partial<CallbacksOptions> {
  /**
   * Invoked when a user needs authorization, using [Middleware](https://nextjs.org/docs/advanced-features/middleware).
   *
   * You can override this behavior by returning a {@link NextResponse}.
   *
   * @example
   * ```ts title="app/auth.ts"
   * ...
   * async authorized({ request, auth, expires }) {
   *   const url = request.nextUrl
   *
   *   if(request.method === "POST") {
   *     const { authToken } = (await request.json()) ?? {}
   *     // If the request has a valid auth token, it is authorized
   *     const valid = await validateAuthToken(authToken)
   *     if(valid) return true
   *     return NextResponse.json("Invalid auth token", { status: 401 })
   *   }
   *
   *   // Logged in users are authenticated, otherwise redirect to login page
   *   return !!auth
   * }
   * ...
   * ```
   */
  authorized: (params: {
    /** The request to be authorized. */
    request: NextRequest
    /** The authenticated user or token, if any. */
    auth: AuthData
    /** The expiration date of the session. */
    expires: string | null
  }) => Awaitable<boolean | NextResponse>
}

/** Configure NextAuth.js. */
export interface NextAuthConfig extends AuthConfig {
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an auth-related action is performed.
   * Callbacks **allow you to implement access controls without a database** or to **integrate with external databases or APIs**.
   */
  callbacks?: NextAuthCallbacks
}

async function getAuth(
  headers: Headers,
  config: NextAuthConfig
): Promise<AuthData & { expires: string }> {
  // TODO: Handle URL correctly (NEXTAUTH_URL, request host, protocol, custom path, etc.)
  const req = new Request("http://n/api/auth/session", {
    headers: { cookie: headers.get("cookie") ?? "" },
  })
  config.trustHost = true
  config.useSecureCookies ??= headers.get("x-forwarded-proto") === "https"
  if (config.callbacks) {
    config.callbacks.session ??= ({ session, user, token }) => ({
      expires: session.expires,
      user,
      token,
    })
  }
  const response = await Auth(req, config)
  return response.json()
}

export interface NextAuthRequest extends NextRequest {
  auth: AuthData
}

export type NextAuthMiddleware = (
  request: NextAuthRequest,
  event: NextFetchEvent
) => ReturnType<NextMiddleware>

export type WithAuthArgs =
  | [NextAuthRequest, NextFetchEvent]
  | [NextAuthMiddleware]
  | [Headers]
  | []

export function initAuth(config: NextAuthConfig) {
  return (...args: WithAuthArgs) => {
    // TODO: use `next/headers` when it's available in Middleware too
    // if (!args.length) return getAuth($headers(), config)
    if (!args.length) return getAuth(new Headers(), config)
    if (args[0] instanceof Headers) return getAuth(args[0], config)
    if (args[0] instanceof Request) {
      // export { auth as default } from "auth"
      const req = args[0]
      const ev = args[1]
      return handleAuth([req, ev as any], config)
    }

    // import { auth } from "auth"
    // export default auth((req) => { console.log(req.auth) }})
    const userMiddleware = args[0]
    return async (...args: Parameters<NextAuthMiddleware>) => {
      return handleAuth(args, config, userMiddleware)
    }
  }
}

/** TODO: structure token similar to User */
export interface AuthData {
  token: JWT | null
  user: User | null
}

async function handleAuth(
  args: Parameters<NextMiddleware>,
  config: NextAuthConfig,
  userMiddleware?: NextAuthMiddleware
) {
  const request = args[0]
  // TODO: pass `next/headers` when it's available
  const {
    token = null,
    user = null,
    expires = null,
  } = (await getAuth(request.headers, config)) ?? {}

  const authorized = config.callbacks?.authorized
    ? await config.callbacks.authorized({
        request,
        auth: { token, user },
        expires,
      })
    : true

  let response: Response = NextResponse.next()

  if (authorized instanceof Response) {
    // User returned a custom response, like redirecting to a page or 401, respect it
    response = authorized
  } else if (userMiddleware) {
    // Execute user's middleware with the augmented request
    const augmentedReq: NextAuthRequest = request as any
    augmentedReq.auth = { token, user }
    response =
      (await userMiddleware(augmentedReq, args[1])) ?? NextResponse.next()
  } else if (!authorized) {
    // Redirect to signin page by default if not authorized
    // TODO: Support custom signin page
    request.nextUrl.pathname = "/api/auth/signin"
    response = NextResponse.redirect(request.nextUrl)
  }

  // We will update the session cookie if it exists,
  // so that the session expiry is extended
  const finalResponse = new NextResponse(response?.body, response)
  // TODO: respect config/prefix/chunking etc.
  const cookiePrefix = request.nextUrl.protocol === "https:" ? "__Secure-" : ""
  const name = `${cookiePrefix}next-auth.session-token`
  const val = request.cookies.get(name)?.value
  // TODO: respect config/prefix/chunking etc.
  if (val) finalResponse.cookies.set(name, val, { expires: new Date(expires!) })
  return finalResponse
}
