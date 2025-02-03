import { Auth, raw, skipCSRFCheck, createActionURL } from "@auth/core"
// @ts-expect-error Next.js does not yet correctly use the `package.json#exports` field
import { headers as nextHeaders, cookies } from "next/headers"
// @ts-expect-error Next.js does not yet correctly use the `package.json#exports` field
import { redirect } from "next/navigation"

import type { NextAuthConfig } from "./index.js"
import type { NextAuthResult, Session } from "../index.js"
import type { ProviderType } from "@auth/core/providers"

type SignInParams = Parameters<NextAuthResult["signIn"]>
export async function signIn(
  provider: SignInParams[0],
  options: SignInParams[1] = {},
  authorizationParams: SignInParams[2],
  config: NextAuthConfig
) {
  const headers = new Headers(await nextHeaders())
  const {
    redirect: shouldRedirect = true,
    redirectTo,
    ...rest
  } = options instanceof FormData ? Object.fromEntries(options) : options

  const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/"
  const signInURL = createActionURL(
    "signin",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers.get("x-forwarded-proto"),
    headers,
    process.env,
    config
  )

  if (!provider) {
    signInURL.searchParams.append("callbackUrl", callbackUrl)
    if (shouldRedirect) redirect(signInURL.toString())
    return signInURL.toString()
  }

  let url = `${signInURL}/${provider}?${new URLSearchParams(
    authorizationParams
  )}`
  let foundProvider: { id?: SignInParams[0]; type?: ProviderType } = {}

  for (const providerConfig of config.providers) {
    const { options, ...defaults } =
      typeof providerConfig === "function" ? providerConfig() : providerConfig
    const id = (options?.id as string | undefined) ?? defaults.id
    if (id === provider) {
      foundProvider = {
        id,
        type: (options?.type as ProviderType | undefined) ?? defaults.type,
      }
      break
    }
  }

  if (!foundProvider.id) {
    const url = `${signInURL}?${new URLSearchParams({ callbackUrl })}`
    if (shouldRedirect) redirect(url)
    return url
  }

  if (foundProvider.type === "credentials") {
    url = url.replace("signin", "callback")
  }

  headers.set("Content-Type", "application/x-www-form-urlencoded")
  const body = new URLSearchParams({ ...rest, callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })
  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  const cookieJar = await cookies()
  for (const c of res?.cookies ?? []) cookieJar.set(c.name, c.value, c.options)

  const responseUrl =
    res instanceof Response ? res.headers.get("Location") : res.redirect

  // NOTE: if for some unexpected reason the responseUrl is not set,
  // we redirect to the original url
  const redirectUrl = responseUrl ?? url

  if (shouldRedirect) return redirect(redirectUrl)

  return redirectUrl as any
}

type SignOutParams = Parameters<NextAuthResult["signOut"]>
export async function signOut(
  options: SignOutParams[0],
  config: NextAuthConfig
) {
  const headers = new Headers(await nextHeaders())
  headers.set("Content-Type", "application/x-www-form-urlencoded")

  const url = createActionURL(
    "signout",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers.get("x-forwarded-proto"),
    headers,
    process.env,
    config
  )
  const callbackUrl = options?.redirectTo ?? headers.get("Referer") ?? "/"
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })

  const res = await Auth(req, { ...config, raw, skipCSRFCheck })

  const cookieJar = await cookies()
  for (const c of res?.cookies ?? []) cookieJar.set(c.name, c.value, c.options)

  if (options?.redirect ?? true) return redirect(res.redirect!)

  return res as any
}

type UpdateParams = Parameters<NextAuthResult["unstable_update"]>
export async function update(
  data: UpdateParams[0],
  config: NextAuthConfig
): Promise<Session | null> {
  const headers = new Headers(await nextHeaders())
  headers.set("Content-Type", "application/json")

  const url = createActionURL(
    "session",
    // @ts-expect-error `x-forwarded-proto` is not nullable, next.js sets it by default
    headers.get("x-forwarded-proto"),
    headers,
    process.env,
    config
  )
  const body = JSON.stringify({ data })
  const req = new Request(url, { method: "POST", headers, body })

  const res: any = await Auth(req, { ...config, raw, skipCSRFCheck })

  const cookieJar = await cookies()
  for (const c of res?.cookies ?? []) cookieJar.set(c.name, c.value, c.options)

  return res.body
}
