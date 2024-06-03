/**
 *
 * :::warning
 * `@auth/qwik` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * Qwik Auth is the official Qwik integration for Auth.js.
 * It provides a simple way to add authentication to your Qwik app in a few lines of code.
 *
 * ## Installation
 * ```bash npm2yarn
 * npm install @auth/qwik
 * ```
 *
 * ## Usage
 *
 * ### Provider Configuration
 *
 * ## Signing in and signing out
 *
 * ## Managing the session
 *
 * ## Authorization
 *
 * ```
 *
 * @module @auth/qwik
 */

import type { AuthConfig } from "@auth/core"
import { Auth, skipCSRFCheck } from "@auth/core"
import type { AuthAction, Session } from "@auth/core/types"
import { implicit$FirstArg, type QRL } from "@builder.io/qwik"
import {
  globalAction$,
  routeLoader$,
  z,
  zod$,
  type RequestEvent,
  type RequestEventCommon,
} from "@builder.io/qwik-city"
import { isServer } from "@builder.io/qwik/build"
import { parseString, splitCookiesString } from "set-cookie-parser"
import { GetSessionResult, QwikAuthConfig, qwikAuthActions } from "./types.js"

export function qwikAuthQrl(
  authOptions: QRL<(ev: RequestEventCommon) => QwikAuthConfig>
) {
  const useAuthSignIn = globalAction$(
    async (
      { providerId, callbackUrl: deprecated, options, authorizationParams },
      req
    ) => {
      if (deprecated) {
        console.warn(
          "\x1b[33mWARNING: callbackUrl is deprecated - use options.callbackUrl instead\x1b[0m"
        )
      }
      const { callbackUrl = deprecated ?? defaultCallbackURL(req), ...rest } =
        options ?? {}

      const isCredentials = providerId === "credentials"

      const auth = await patchAuthOptions(authOptions, req)
      const body = new URLSearchParams({ callbackUrl: callbackUrl as string })
      Object.entries(rest).forEach(([key, value]) => {
        body.set(key, String(value))
      })

      const baseSignInUrl = `/api/auth/${
        isCredentials ? "callback" : "signin"
      }${providerId ? `/${providerId}` : ""}`
      const signInUrl = `${baseSignInUrl}?${new URLSearchParams(
        authorizationParams
      )}`

      const data = await authAction(body, req, signInUrl, auth)

      // set authjs.callback-url cookie. Fix for https://github.com/QwikDev/qwik/issues/5227
      req.cookie.set("authjs.callback-url", callbackUrl, {
        path: "/",
      })

      if (data.url) {
        throw req.redirect(301, data.url)
      }
    },
    zod$({
      providerId: z.string().optional(),
      callbackUrl: z.string().optional(),
      options: z
        .object({
          callbackUrl: z.string(),
        })
        .passthrough()
        .partial()
        .optional(),
      authorizationParams: z
        .union([z.string(), z.custom<URLSearchParams>(), z.record(z.string())])
        .optional(),
    })
  )

  const useAuthSignOut = globalAction$(
    async ({ callbackUrl }, req) => {
      callbackUrl ??= defaultCallbackURL(req)
      const auth = await patchAuthOptions(authOptions, req)
      const body = new URLSearchParams({ callbackUrl })
      await authAction(body, req, `/api/auth/signout`, auth)
    },
    zod$({
      callbackUrl: z.string().optional(),
    })
  )

  const useAuthSession = routeLoader$((req) => {
    return req.sharedMap.get("session") as Session | null
  })

  const onRequest = async (req: RequestEvent) => {
    if (isServer) {
      const prefix: string = "/api/auth"

      const action = req.url.pathname
        .slice(prefix.length + 1)
        .split("/")[0] as AuthAction

      const auth = await patchAuthOptions(authOptions, req)
      if (
        qwikAuthActions.includes(action) &&
        req.url.pathname.startsWith(prefix + "/")
      ) {
        const res = (await Auth(req.request, auth)) as Response
        const cookie = res.headers.get("set-cookie")
        if (cookie) {
          req.headers.set("set-cookie", cookie)
          res.headers.delete("set-cookie")
          fixCookies(req)
        }
        throw req.send(res)
      } else {
        const { data, cookie } = await getSessionData(req.request, auth)
        req.sharedMap.set("session", data)
        if (cookie) {
          req.headers.set("set-cookie", cookie)
          fixCookies(req)
        }
      }
    }
  }

  return {
    useAuthSignIn,
    useAuthSignOut,
    useAuthSession,
    onRequest,
  }
}

export const qwikAuth$ = /*#__PURE__*/ implicit$FirstArg(qwikAuthQrl)

async function authAction(
  body: URLSearchParams | undefined,
  req: RequestEventCommon,
  path: string,
  authOptions: QwikAuthConfig
) {
  const request = new Request(new URL(path, req.request.url), {
    method: req.request.method,
    headers: req.request.headers,
    body: body,
  })
  request.headers.set("content-type", "application/x-www-form-urlencoded")
  const res = (await Auth(request, {
    ...authOptions,
    skipCSRFCheck,
  })) as Response

  const cookies: string[] = []
  res.headers.forEach((value, key) => {
    if (key === "set-cookie") {
      // while browsers would support setting multiple cookies, the fetch implementation does not, so we join them later.
      cookies.push(value)
    } else if (!req.headers.has(key)) {
      req.headers.set(key, value)
    }
  })

  if (cookies.length > 0) {
    req.headers.set("set-cookie", cookies.join(", "))
  }

  fixCookies(req)

  try {
    return await res.json()
  } catch (error) {
    return await res.text()
  }
}

const fixCookies = (req: RequestEventCommon) => {
  req.headers.set("set-cookie", req.headers.get("set-cookie") || "")
  const cookie = req.headers.get("set-cookie")
  if (cookie) {
    req.headers.delete("set-cookie")
    splitCookiesString(cookie).forEach((cookie) => {
      const { name, value, ...rest } = parseString(cookie)
      req.cookie.set(name, value, rest as any)
    })
  }
}

export const ensureAuthMiddleware = (req: RequestEvent) => {
  const isLoggedIn = req.sharedMap.has("session")
  if (!isLoggedIn) {
    throw req.error(403, "sfs")
  }
}

const defaultCallbackURL = (req: RequestEventCommon) => {
  req.url.searchParams.delete("qaction")
  return req.url.href
}

async function getSessionData(
  req: Request,
  options: AuthConfig
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const response = (await Auth(
    new Request(url, { headers: req.headers }),
    options
  )) as Response

  const { status = 200 } = response

  const data = await response.json()
  const cookie = response.headers.get("set-cookie")
  if (!data || !Object.keys(data).length) {
    return { data: null, cookie }
  }
  if (status === 200) {
    return { data, cookie }
  }

  throw new Error(data.message)
}

const patchAuthOptions = async (
  authOptions: QRL<(ev: RequestEventCommon) => QwikAuthConfig>,
  req: RequestEventCommon
) => {
  const options = await authOptions(req)
  return { ...options, basePath: "/api/auth" }
}
