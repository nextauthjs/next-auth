import { redirect } from "@sveltejs/kit"
import type { RequestEvent } from "@sveltejs/kit"
import { parse } from "set-cookie-parser"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"

import { Auth, raw, skipCSRFCheck } from "@auth/core"
import type { AuthAction } from "@auth/core/types"
import type { SvelteKitAuthConfig } from "./types"
import { setEnvDefaults } from "./env"

type SignInParams = Parameters<App.Locals["signIn"]>
export async function signIn(
  provider: SignInParams[0],
  options: SignInParams[1] = {},
  authorizationParams: SignInParams[2],
  config: SvelteKitAuthConfig,
  event: RequestEvent
) {
  const { request } = event
  const headers = new Headers(request.headers)
  const {
    redirect: shouldRedirect = true,
    redirectTo,
    ...rest
  } = options instanceof FormData ? Object.fromEntries(options) : options

  const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/"
  const base = createActionURL("signin", headers, config.basePath)

  if (!provider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) redirect(302, url)
    return url
  }

  let url = `${base}/${provider}?${new URLSearchParams(authorizationParams)}`
  let foundProvider: SignInParams[0] | undefined = undefined

  for (const _provider of config.providers) {
    const { id } = typeof _provider === "function" ? _provider() : _provider
    if (id === provider) {
      foundProvider = id
      break
    }
  }

  if (!foundProvider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) redirect(302, url)
    return url
  }

  if (foundProvider === "credentials") {
    url = url.replace("signin", "callback")
  }

  headers.set("Content-Type", "application/x-www-form-urlencoded")
  const body = new URLSearchParams({ ...rest, callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })
  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) {
    event.cookies.set(c.name, c.value, { path: "/", ...c.options })
  }

  if (shouldRedirect) {
    return redirect(302, res.redirect!)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.redirect as any
}

type SignOutParams = Parameters<App.Locals["signOut"]>
export async function signOut(
  options: SignOutParams[0],
  config: SvelteKitAuthConfig,
  event: RequestEvent
) {
  const { request } = event
  const headers = new Headers(request.headers)
  headers.set("Content-Type", "application/x-www-form-urlencoded")

  const url = createActionURL("signout", headers, config.basePath)
  const callbackUrl = options?.redirectTo ?? headers.get("Referer") ?? "/"
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })

  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? [])
    event.cookies.set(c.name, c.value, { path: "/", ...c.options })

  if (options?.redirect ?? true) return redirect(302, res.redirect!)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res as any
}

export async function auth(
  event: RequestEvent,
  config: SvelteKitAuthConfig
): ReturnType<App.Locals["auth"]> {
  setEnvDefaults(env, config)
  config.trustHost ??= true

  const { request: req } = event

  const sessionUrl = createActionURL("session", req.headers, config.basePath)
  const request = new Request(sessionUrl, {
    headers: { cookie: req.headers.get("cookie") ?? "" },
  })
  const response = await Auth(request, config)

  const authCookies = parse(response.headers.getSetCookie())
  for (const cookie of authCookies) {
    const { name, value, ...options } = cookie
    // @ts-expect-error - Review: SvelteKit and set-cookie-parser are mismatching
    event.cookies.set(name, value, { path: "/", ...options })
  }

  const { status = 200 } = response
  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

/**
 * Extract the origin and base path from either `AUTH_URL` or `NEXTAUTH_URL` environment variables,
 * or the request's headers and the {@link NextAuthConfig.basePath} option.
 */
export function createActionURL(
  action: AuthAction,
  headers: Headers,
  basePath?: string
) {
  let url = env.AUTH_URL
  if (!url) {
    const host = headers.get("x-forwarded-host") ?? headers.get("host")
    const proto = headers.get("x-forwarded-proto")
    url = `${proto === "http" || dev ? "http" : "https"}://${host}${basePath}`
  }
  return new URL(`${url.replace(/\/$/, "")}/${action}`)
}
