import { Auth, type AuthConfig } from "@auth/core"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { Awaitable, CallbacksOptions, Session } from "@auth/core/types"
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module"
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
  authorized?: (params: {
    /** The request to be authorized. */
    request: NextRequest
    /** The authenticated user or token, if any. */
    auth: Session
    /** The expiration date of the session. */
    expires: string | null
  }) => Awaitable<boolean | NextResponse | undefined>
}

/** Configure NextAuth.js. */
export interface NextAuthConfig extends AuthConfig {
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an auth-related action is performed.
   * Callbacks **allow you to implement access controls without a database** or to **integrate with external databases or APIs**.
   */
  callbacks?: NextAuthCallbacks
}

/** @deprecated Use {@link NextAuthConfig} instead. */
export interface NextAuthOptions extends NextAuthConfig {}

function detectOrigin(headers: Headers | object) {
  const _headers = new Headers(headers as any)
  const host = _headers.get("x-forwarded-host") ?? _headers.get("host")
  const protocol =
    _headers.get("x-forwarded-proto") === "http" ? "http" : "https"
  // TODO: Handle URL correctly (NEXTAUTH_URL, request host, protocol, custom path, etc.)
  return new URL(`${protocol}://${host}`)
}

async function runAuth(headers: Headers, config: NextAuthConfig) {
  const origin = detectOrigin(headers)
  const req = new Request(`${origin}/api/auth/session`, {
    headers: { cookie: headers.get("cookie") ?? "" },
  })
  config.useSecureCookies ??= origin.protocol === "https"

  // Since we are server-side, we don't need to filter out the session data
  // See https://nextjs.authjs.dev/v5#authenticating-server-side
  config.callbacks = Object.assign(config.callbacks ?? {}, {
    session({ session, user, token }) {
      return { expires: session.expires, user: user ?? token }
    },
  })
  return Auth(req, config)
}

export interface NextAuthRequest extends NextRequest {
  auth: Session
}

export type NextAuthMiddleware = (
  request: NextAuthRequest,
  event: NextFetchEvent
) => ReturnType<NextMiddleware>

export type WithAuthArgs =
  | [NextAuthRequest, any]
  | [NextAuthMiddleware]
  | [AppRouteHandlerFn]
  | [NextApiRequest, NextApiResponse]
  | [GetServerSidePropsContext]
  | []

function isReqWrapper(arg: any): arg is NextAuthMiddleware | AppRouteHandlerFn {
  return typeof arg === "function"
}

export function initAuth(config: NextAuthConfig) {
  return async (...args: WithAuthArgs) => {
    if (!args.length) return runAuth(headers(), config).then((r) => r.json())
    if (args[0] instanceof Request) {
      // middleare.ts
      // export { auth as default } from "auth"
      const req = args[0]
      const ev = args[1]
      return handleAuth([req, ev as any], config)
    }

    if (isReqWrapper(args[0])) {
      // middleare.ts/router.ts
      // import { auth } from "auth"
      // export default auth((req) => { console.log(req.auth) }})
      const userMiddlewareOrRoute = args[0]
      return async (
        ...args: Parameters<NextAuthMiddleware | AppRouteHandlerFn>
      ) => {
        return handleAuth(args, config, userMiddlewareOrRoute)
      }
    }

    const request = "req" in args[0] ? args[0].req : args[0]
    const response: any = "res" in args[0] ? args[0].res : args[1]

    const authResponse = await runAuth(
      new Headers(request.headers as any),
      config
    )
    const { user = null, expires = null } = (await authResponse.json()) ?? {}

    // Preserve cookies set by Auth.js Core
    const cookies = authResponse.headers.get("set-cookie")
    if (cookies) response?.setHeader("set-cookie", cookies)

    return { user, expires } as Session
  }
}

async function handleAuth(
  args: Parameters<NextMiddleware | AppRouteHandlerFn>,
  config: NextAuthConfig,
  userMiddlewareOrRoute?: NextAuthMiddleware | AppRouteHandlerFn
) {
  const request = args[0]
  const authResponse = await runAuth(request.headers, config)
  const { user = null, expires = null } = (await authResponse.json()) ?? {}

  const authorized =
    (await config.callbacks?.authorized?.({
      request,
      auth: { user, expires },
      expires,
    })) ?? true

  let response: Response = NextResponse.next()

  if (authorized instanceof Response) {
    // User returned a custom response, like redirecting to a page or 401, respect it
    response = authorized
  } else if (userMiddlewareOrRoute) {
    // Execute user's middleware/handler with the augmented request
    const augmentedReq: NextAuthRequest = request as any
    augmentedReq.auth = { user, expires }
    response =
      // @ts-expect-error
      (await userMiddlewareOrRoute(augmentedReq, args[1])) ??
      NextResponse.next()
  } else if (!authorized) {
    // Redirect to signin page by default if not authorized
    request.nextUrl.pathname = config.pages?.signIn ?? "/api/auth/signin"
    response = NextResponse.redirect(request.nextUrl)
  }

  // Preserve cookies set by Auth.js Core
  const finalResponse = new NextResponse(response?.body, response)
  if (authResponse.headers.has("set-cookie")) {
    finalResponse.headers.set(
      "set-cookie",
      authResponse.headers.get("set-cookie")!
    )
  }

  return finalResponse
}
