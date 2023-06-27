import { Auth, type AuthConfig } from "@auth/core"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import type { AuthAction, Awaitable, Session } from "@auth/core/types"
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/module"
import type { NextFetchEvent, NextMiddleware, NextRequest } from "next/server"

/** Configure NextAuth.js. */
export interface NextAuthConfig extends AuthConfig {
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an auth-related action is performed.
   * Callbacks **allow you to implement access controls without a database** or to **integrate with external databases or APIs**.
   */
  callbacks?: AuthConfig["callbacks"] & {
    /**
     * Invoked when a user needs authorization, using [Middleware](https://nextjs.org/docs/advanced-features/middleware).
     *
     * You can override this behavior by returning a {@link NextResponse}.
     *
     * @example
     * ```ts title="app/auth.ts"
     * ...
     * async authorized({ request, auth }) {
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
     *   return !!auth.user
     * }
     * ...
     * ```
     *
     * :::warning
     * If you are returning a redirect response, make sure that the page you are redirecting to is not protected by this callback,
     * otherwise you could end up in an infinite redirect loop.
     * :::
     */
    authorized?: (params: {
      /** The request to be authorized. */
      request: NextRequest
      /** The authenticated user or token, if any. */
      auth: Session | null
    }) => Awaitable<boolean | NextResponse | undefined>
  }
}

function detectOrigin(_headers: Headers | ReturnType<typeof headers>) {
  const host = _headers.get("x-forwarded-host") ?? _headers.get("host")
  const protocol =
    _headers.get("x-forwarded-proto") === "http" ? "http" : "https"
  return new URL(process.env.NEXTAUTH_URL ?? `${protocol}://${host}`)
}

/** Server-side method to read the session. */
async function getSession(headers: Headers, config: NextAuthConfig) {
  const origin = detectOrigin(headers)
  const request = new Request(`${origin}/api/auth/session`, {
    headers: { cookie: headers.get("cookie") ?? "" },
  })
  config.useSecureCookies ??= origin.protocol === "https:"

  // Since we are server-side, we don't need to filter out the session data
  // See https://nextjs.authjs.dev/v5#authenticating-server-side
  config.callbacks = Object.assign(config.callbacks ?? {}, {
    session({ session, user, token }) {
      return { ...session, user: user ?? token }
    },
  })
  return Auth(request, config)
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
  return (...args: WithAuthArgs) => {
    if (!args.length) return getSession(headers(), config).then((r) => r.json())
    if (args[0] instanceof Request) {
      // middleare.ts
      // export { auth as default } from "auth"
      const req = args[0]
      const ev = args[1]
      return handleAuth([req, ev], config)
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

    // API Routes, getServerSideProps
    const request = "req" in args[0] ? args[0].req : args[0]
    const response: any = "res" in args[0] ? args[0].res : args[1]

    return getSession(
      // @ts-expect-error
      new Headers(request.headers),
      config
    ).then(async (authResponse) => {
      const {
        user = null,
        expires = null,
        ...rest
      } = (await authResponse.json()) ?? {}

      // Preserve cookies set by Auth.js Core
      const cookies = authResponse.headers.get("set-cookie")
      if (cookies) response?.setHeader("set-cookie", cookies)

      return { user, expires, ...rest } satisfies Session
    })
  }
}

async function handleAuth(
  args: Parameters<NextMiddleware | AppRouteHandlerFn>,
  config: NextAuthConfig,
  userMiddlewareOrRoute?: NextAuthMiddleware | AppRouteHandlerFn
) {
  const request = args[0]
  const sessionResponse = await getSession(request.headers, config)
  const {
    user = null,
    expires = null,
    ...rest
  } = (await sessionResponse.json()) ?? {}

  // If we are handling a recognized NextAuth.js request,
  // don't require authorization to avoid an accidental redirect loop
  let authorized: boolean | NextResponse | undefined = true

  // Infer basePath from NEXTAUTH_URL if provided, default to /api/auth
  const { pathname: basePath } = new URL(
    process.env.NEXTAUTH_URL ?? "http://a/api/auth"
  )

  if (
    !isNextAuthAction(request, config, basePath) &&
    config.callbacks?.authorized
  ) {
    authorized = await config.callbacks.authorized({
      request,
      auth: { user, expires, ...rest },
    })
  }

  let response: Response = NextResponse.next?.()

  if (authorized instanceof Response) {
    // User returned a custom response, like redirecting to a page or 401, respect it
    response = authorized
  } else if (userMiddlewareOrRoute) {
    // Execute user's middleware/handler with the augmented request
    const augmentedReq = request as NextAuthRequest
    augmentedReq.auth = { user, expires, ...rest }
    response =
      // @ts-expect-error
      (await userMiddlewareOrRoute(augmentedReq, args[1])) ??
      NextResponse.next()
  } else if (!authorized) {
    const signInPage = config.pages?.signIn ?? "/api/auth/signin"
    if (request.nextUrl.pathname !== signInPage) {
      // Redirect to signin page by default if not authorized
      request.nextUrl.pathname = signInPage
      request.nextUrl.searchParams.set("callbackUrl", request.nextUrl.href)
      response = NextResponse.redirect(request.nextUrl)
    }
  }

  // Preserve cookies set by Auth.js Core
  const finalResponse = new Response(response?.body, response)
  const authCookies = sessionResponse.headers.get("set-cookie")
  if (authCookies) finalResponse.headers.set("set-cookie", authCookies)

  return finalResponse
}

/** Check if the request is for a NextAuth.js action. */
function isNextAuthAction(
  req: NextRequest,
  config: NextAuthConfig,
  basePath: string
) {
  const { pathname } = req.nextUrl

  const action = pathname.replace(`${basePath}/`, "") as AuthAction
  const pages = Object.values(config.pages ?? {})

  return actions.has(action) || pages.some((page) => pathname === page)
}

const actions = new Set<AuthAction>([
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
])
