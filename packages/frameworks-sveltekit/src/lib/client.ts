import { base } from "$app/paths"
import type { ProviderId } from "@auth/core/providers"

interface SignInOptions<Redirect extends boolean = true>
  extends Record<string, unknown> {
  /** @deprecated Use `redirectTo` instead. */
  callbackUrl?: string
  /**
   * Specify where the user should be redirected to after a successful signin.
   *
   * By default, it is the page the sign-in was initiated from.
   */
  redirectTo?: string
  /**
   * You might want to deal with the signin response on the same page, instead of redirecting to another page.
   * For example, if an error occurs (like wrong credentials given by the user), you might want to show an inline error message on the input field.
   *
   * For this purpose, you can set this to option `redirect: false`.
   */
  redirect?: Redirect
}

interface SignInResponse {
  error: string | undefined
  code: string | undefined
  status: number
  ok: boolean
  url: string | null
}

interface SignOutParams<R extends boolean = true> {
  /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
  callbackUrl?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 *
 * [Documentation](https://authjs.dev/reference/sveltekit/client#signin)
 */

/**
 * Initiates a signin flow or sends the user to the signin page listing all possible providers.
 * Handles CSRF protection.
 *
 * @note This method can only be used from Client Components ("use client" or Pages Router).
 * For Server Actions, use the `signIn` method imported from the `auth` config.
 */
export async function signIn(
  provider?: ProviderId,
  options?: SignInOptions<true>,
  authorizationParams?: SignInAuthorizationParams
): Promise<void>
export async function signIn(
  provider?: ProviderId,
  options?: SignInOptions<false>,
  authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse>
export async function signIn<Redirect extends boolean = true>(
  provider?: ProviderId,
  options?: SignInOptions<Redirect>,
  authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse | void> {
  const { callbackUrl, ...rest } = options ?? {}
  const {
    redirect = true,
    redirectTo = callbackUrl ?? window.location.href,
    ...signInParams
  } = rest

  const baseUrl = base ?? ""

  const signInUrl = `${baseUrl}/${
    provider === "credentials" ? "callback" : "signin"
  }/${provider}`

  const res = await fetch(
    `${signInUrl}?${new URLSearchParams(authorizationParams)}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      },
      body: new URLSearchParams({
        ...signInParams,
        callbackUrl: redirectTo,
      }),
    }
  )

  const data = await res.json()

  if (redirect) {
    const url = data.url ?? redirectTo
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    return
  }

  const error = new URL(data.url).searchParams.get("error") ?? undefined
  const code = new URL(data.url).searchParams.get("code") ?? undefined

  return {
    error,
    code,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  }
}

/**
 * Signs the user out, by removing the session cookie.
 *
 * [Documentation](https://authjs.dev/reference/sveltekit/client#signout)
 */
export async function signOut(options?: SignOutParams) {
  const { callbackUrl = window.location.href } = options ?? {}
  const basePath = base ?? ""
  const res = await fetch(`${basePath}/auth/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      callbackUrl,
    }),
  })
  const data = await res.json()

  const url = data.url ?? callbackUrl
  window.location.href = url
  // If url contains a hash, the browser does not reload the page. We reload manually
  if (url.includes("#")) window.location.reload()
}
