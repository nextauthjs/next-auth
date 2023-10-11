import { Auth, raw, skipCSRFCheck } from "@auth/core"
import { headers as nextHeaders, cookies } from "next/headers"
import { redirect } from "next/navigation"

import { detectOrigin } from "./env.js"

import type { NextAuthConfig } from "./index.js"
import type { AuthSession, NextAuthResult } from "../index.js"

type SignInParams = Parameters<NextAuthResult["signIn"]>
export async function signIn(
  provider: SignInParams[0],
  options: SignInParams[1],
  config: NextAuthConfig
) {
  let foundProvider: string | undefined = undefined
  for (const p of config.providers)
    foundProvider = (typeof p === "function" ? p() : p).type

  const headers = new Headers(nextHeaders())
  const {
    redirect: shouldRedirect = true,
    redirectTo: callbackUrl = headers.get("Referer") ?? "/",
    ...rest
  } = options ?? {}
  const base = `${detectOrigin(headers)}/signin`
  let url = `${base}/${provider}`

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
  const res: any = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  if (shouldRedirect) return redirect(res.redirect)

  return res
}

type SignOutParams = Parameters<NextAuthResult["signOut"]>
export async function signOut(
  options: SignOutParams[0],
  config: NextAuthConfig
) {
  const headers = new Headers(nextHeaders())
  headers.set("Content-Type", "application/x-www-form-urlencoded")

  const url = `${detectOrigin(headers)}/signout`
  const callbackUrl = options?.redirectTo ?? headers.get("Referer") ?? "/"
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })

  const res: any = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  if (options?.redirect ?? true) return redirect(res.redirect)

  return res
}

type UpdateParams = Parameters<NextAuthResult["update"]>
export async function update(
  data: UpdateParams[0],
  config: NextAuthConfig
): Promise<AuthSession | null> {
  const headers = new Headers(nextHeaders())
  headers.set("Content-Type", "application/json")

  const url = `${detectOrigin(headers)}session`
  const body = JSON.stringify({ data })
  const req = new Request(url, { method: "POST", headers, body })

  const res: any = await Auth(req, { ...config, raw, skipCSRFCheck })

  for (const c of res?.cookies ?? []) cookies().set(c.name, c.value, c.options)

  return res.body
}
