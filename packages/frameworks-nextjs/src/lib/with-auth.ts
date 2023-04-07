import { Auth, type AuthConfig } from "@auth/core"
import type { JWT } from "@auth/core/jwt"
import type { User } from "@auth/core/types"
import { NextMiddlewareResult } from "next/dist/server/web/types"
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server"

export async function getAuth(
  headers: Headers,
  config: AuthConfig
): Promise<AuthData> {
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
  console.log(response.headers.get("set-cookie"))

  const data = await response.json()
  if (!data || !Object.keys(data).length) return null
  return data
}

export type MiddlewareParams = Parameters<NextMiddleware>
export type WithAuthMiddleware = (
  request: MiddlewareParams[0] & { auth: JWT | User | null },
  ev: MiddlewareParams[1]
) => Promise<NextMiddlewareResult>

export interface NextRequestWithAuth extends NextRequest {
  auth: JWT | User | null
}

export type NextMiddlewareWithAuth = (
  request: NextRequestWithAuth,
  event: NextFetchEvent
) => ReturnType<NextMiddleware>

export type WithAuthArgs =
  | [NextRequestWithAuth, NextFetchEvent]
  | [NextMiddlewareWithAuth]

export function createWithAuth(config: AuthConfig) {
  return (...args: WithAuthArgs) => {
    if (args[0] instanceof Request) {
      const req = args[0]
      // const auth = await withAuth(req)
      if (args.length === 1) return handleMiddleware(req, config, (a) => a)
      // export { withAuth as default } from "app/auth"
      return handleMiddleware(req, config)
    }

    // import { withAuth } from "app/auth"
    // export default withAuth((req) => { console.log(req.auth) }})
    const middleware = args[0]
    return async (...args: Parameters<NextMiddlewareWithAuth>) => {
      return handleMiddleware(args[0], config, async (auth) => {
        args[0].auth = auth
        return middleware(...args)
      })
    }
  }
}

export type AuthData = JWT | User | null

async function handleMiddleware(
  req: NextRequest,
  config: AuthConfig,
  onSuccess?: (auth: AuthData) => ReturnType<NextMiddleware> | AuthData
) {
  const request = req
  const auth = await getAuth(request.headers, config)

  const authorized =
    (await config.callbacks?.authorized?.({ request, auth })) ?? !!auth

  if (authorized instanceof Response) return authorized
  else if (authorized) return onSuccess?.(auth)
  else if (onSuccess) return onSuccess(auth)
  // TODO: Support custom signin page
  req.nextUrl.pathname = "/api/auth/signin"
  return NextResponse.redirect(req.nextUrl)
}
