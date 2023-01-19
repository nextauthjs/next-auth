import { Auth } from "@auth/core"
import type { AuthConfig, AuthAction, Session } from "@auth/core/types"
import { type Cookie, parseString, splitCookiesString } from "set-cookie-parser"
import { serialize } from "cookie"
import crypto from 'node:crypto'

// Prior to Node 19.0.0, we need the following polyfills
// This gives us at the very least support for Node ^17.4.0
// See: https://github.com/nextauthjs/next-auth/issues/6417#issuecomment-1384660656
// @ts-expect-error
if (typeof globalThis.crypto.subtle === "undefined") globalThis.crypto.subtle = crypto.webcrypto.subtle
if (typeof globalThis.crypto.randomUUID === "undefined") globalThis.crypto.randomUUID = crypto.randomUUID

export interface AstroAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  prefix?: string
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

// solves the same issue that exists in @auth/solid-js
const getSetCookieCallback = (cook?: string | null): Cookie | undefined => {
  if (!cook) return
  const splitCookie = splitCookiesString(cook)
  for (const cookName of [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "next-auth.pkce.code_verifier",
    "__Secure-next-auth.pkce.code_verifier",
  ]) {
    const temp = splitCookie.find((e) => e.startsWith(`${cookName}=`))
    if (temp) {
      return parseString(temp)
    }
  }
  return parseString(splitCookie?.[0] ?? "") // just return the first cookie if no session token is found
}

function AstroAuthHandler(
  prefix: string,
  authConfig: AstroAuthConfig
) {
  return async ({ request }: { request: Request }) => {
    const url = new URL(request.url)
    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/"))
      return

    const res = await Auth(request, authConfig)
    if (["callback", "signin", "signout"].includes(action)) {
      const parsedCookie = getSetCookieCallback(
        res.clone().headers.get("Set-Cookie")
      )
      if (parsedCookie) {
        res.headers.set(
          "Set-Cookie",
          serialize(parsedCookie.name, parsedCookie.value, parsedCookie as any)
        )
      }
    }
    return res
  }
}

export function AstroAuth(config: AstroAuthConfig) {
  const { prefix = "/api/auth", ...authConfig } = config
  // @ts-expect-error import.meta.env is used by Astro
  const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env

  authConfig.secret ??= AUTH_SECRET
  authConfig.trustHost ??= !!(
    AUTH_TRUST_HOST ??
    VERCEL ??
    NODE_ENV !== "production"
  )

  const handler = AstroAuthHandler(prefix, authConfig)
  return {
    async get(event: any) {
      return await handler(event)
    },
    async post(event: any) {
      return await handler(event)
    },
  }
}

export async function getSession(
  req: Request,
  options: AstroAuthConfig
): Promise<Session | null> {
  // @ts-expect-error import.meta.env is used by Astro
  options.secret ??= import.meta.env.AUTH_SECRET
  options.trustHost ??= true

  const url = new URL(`${options.prefix}/session`, req.url)
  const response = await Auth(
    new Request(url, { headers: req.headers }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
