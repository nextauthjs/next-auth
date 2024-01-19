import { Auth, raw, skipCSRFCheck } from "@auth/core"
import { headers as nextHeaders, cookies } from "next/headers"
import { redirect } from "next/navigation"

import type { AuthAction } from "@auth/core/types.js"
import type { NextAuthConfig } from "./index.js"
import type { NextAuthResult, Session } from "../index.js"
import type { headers } from "next/headers"

type SignInParams = Parameters<NextAuthResult["signIn"]>
export async function signIn(
  provider: SignInParams[0],
  options: SignInParams[1] = {},
  authorizationParams: SignInParams[2],
  config: NextAuthConfig
) {
  const headers = new Headers(nextHeaders())
  const {
    redirect: shouldRedirect = true,
    redirectTo,
    ...rest
  } = options instanceof FormData ? Object.fromEntries(options) : options

  const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/"
  const base = createActionURL("signin", headers, config.basePath)

  if (!provider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) redirect(url)
    return url
  }

  let url = `${base}/${provider}?${new URLSearchParams(authorizationParams)}`
  let foundProvider: SignInParams[0] | undefined = undefined

  for (const _provider of config.providers) {
    const { id } = typeof _provider === "function" ? _provider?.() : _provider
    if (id === provider) {
      foundProvider = id
      break
    }
  }

  if (!foundProvider) {
    const url = `${base}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) redirect(url)
    return url
  }

  if (foundProvider === "credentials") {
    url = url.replace("signin", "callback")
  }

  headers.set("Content-Type", "application/x-www-form-urlencoded")
  const body = new URLSearchParams({ ...rest, callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })
  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  if (shouldRedirect) return redirect(res.redirect!)
  return res.redirect as any
}

type SignOutParams = Parameters<NextAuthResult["signOut"]>
export async function signOut(
  options: SignOutParams[0],
  config: NextAuthConfig
) {
  const headers = new Headers(nextHeaders())
  headers.set("Content-Type", "application/x-www-form-urlencoded")

  const url = createActionURL("signout", headers, config.basePath)
  const callbackUrl = options?.redirectTo ?? headers.get("Referer") ?? "/"
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })

  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  if (options?.redirect ?? true) return redirect(res.redirect!)

  return res as any
}

type UpdateParams = Parameters<NextAuthResult["unstable_update"]>
export async function update(
  data: UpdateParams[0],
  config: NextAuthConfig
): Promise<Session | null> {
  const headers = new Headers(nextHeaders())
  headers.set("Content-Type", "application/json")

  const url = createActionURL("session", headers, config.basePath)
  const body = JSON.stringify({ data })
  const req = new Request(url, { method: "POST", headers, body })

  const res: any = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  return res.body
}

/**
 * Extract the origin and base path from either `AUTH_URL` or `NEXTAUTH_URL` environment variables,
 * or the request's headers and the {@link NextAuthConfig.basePath} option.
 */
export function createActionURL(
  action: AuthAction,
  h: Headers | ReturnType<typeof headers>,
  basePath?: string
) {
  const envUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (envUrl) {
    const { origin, pathname } = new URL(envUrl)
    const separator = pathname.endsWith("/") ? "" : "/"
    return `${origin}${pathname}${separator}${action}`
  }
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const protocol = h.get("x-forwarded-proto") === "http" ? "http" : "https"
  // @ts-expect-error `basePath` value is default'ed to "/api/auth" in `setEnvDefaults`
  const { origin, pathname } = new URL(basePath, `${protocol}://${host}`)
  const separator = pathname.endsWith("/") ? "" : "/"
  return `${origin}${pathname}${separator}${action}`
}
