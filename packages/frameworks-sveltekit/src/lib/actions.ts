import { redirect } from "@sveltejs/kit"
import type { RequestEvent } from "@sveltejs/kit"
import { parse } from "set-cookie-parser"
import { env } from "$env/dynamic/private"

import { Auth, createActionURL, raw } from "@auth/core"
import type { ProviderType } from "@auth/core/providers"
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
  const {
    request,
    url: { protocol },
  } = event
  const headers = new Headers(request.headers)
  const {
    redirect: shouldRedirect = true,
    redirectTo,
    ...rest
  } = options instanceof FormData ? Object.fromEntries(options) : options

  const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/"
  const signInURL = createActionURL("signin", protocol, headers, env, config?.basePath)

  if (!provider) {
    signInURL.searchParams.append("callbackUrl", callbackUrl)
    if (shouldRedirect) redirect(302, signInURL.toString())
    return signInURL.toString()
  }

  let url = `${signInURL}/${provider}?${new URLSearchParams(authorizationParams)}`
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
    if (shouldRedirect) redirect(302, url)
    return url
  }

  if (foundProvider.type === "credentials") {
    url = url.replace("signin", "callback")
  }

  headers.set("Content-Type", "application/x-www-form-urlencoded")
  const body = new URLSearchParams({ ...rest, callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })
  const res = await Auth(req, { ...config, raw })

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
  const {
    request,
    url: { protocol },
  } = event
  const headers = new Headers(request.headers)
  headers.set("Content-Type", "application/x-www-form-urlencoded")

  const url = createActionURL("signout", protocol, headers, env, config?.basePath)
  const callbackUrl = options?.redirectTo ?? headers.get("Referer") ?? "/"
  const body = new URLSearchParams({ callbackUrl })
  const req = new Request(url, { method: "POST", headers, body })

  const res = await Auth(req, { ...config, raw })

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

  const {
    request: req,
    url: { protocol },
  } = event

  const sessionUrl = createActionURL(
    "session",
    protocol,
    req.headers,
    env,
    config?.basePath
  )
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
