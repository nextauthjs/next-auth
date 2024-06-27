import type {
  Provider,
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"
import type { FetchResponse } from "ofetch"
import { useAuth } from "../composables/useAuth"
/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

type ProviderID<P> = LiteralUnion<
  P extends RedirectableProviderType
    ? P | BuiltInProviderType
    : BuiltInProviderType
>

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
   *
   * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
   */
  callbackUrl?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
  redirect?: boolean
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

type SignInResponse = Awaited<FetchResponse<{ url: string }>>

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * ```ts
 * import { signIn } from "@auth/nuxt/client"
 * signIn()
 * signIn("provider") // example: signIn("github")
 * ```
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  providerId?: ProviderID<P>,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
): Promise<void | SignInResponse> {
  const { auth } = useAuth()

  try {
    const { callbackUrl = window.location.href, redirect = true } =
      options ?? {}
    const { basePath } = useRuntimeConfig().public.authJs

    const isCredentials = providerId === "credentials"
    const isEmail = providerId === "email"
    const isSupportingReturn = isCredentials || isEmail

    const signInUrl = `${basePath}/${
      isCredentials ? "callback" : "signin"
    }/${providerId}`
    const _signInUrl = `${signInUrl}?${new URLSearchParams(
      authorizationParams
    )}`

    const { csrfToken } = await $fetch<{ csrfToken: string }>(
      `${basePath}/csrf`
    )
    if (!csrfToken) throw new Error("CSRF token not found")

    const response = await $fetch.raw<{ url: string }>(_signInUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      },
      // @ts-expect-error -- ignore
      body: new URLSearchParams({
        ...options,
        csrfToken,
        callbackUrl,
      }),
    })

    const url = response?._data?.url ?? null
    const error = url ? new URL(url).searchParams.get("error") : null
    if (error) throw new Error(error)

    if (isCredentials && !redirect)
      reloadNuxtApp({ persistState: true, force: true })

    if (redirect || !isSupportingReturn) {
      // TODO: Do not redirect for Credentials and Email providers by default in next major
      const to = url ?? callbackUrl
      await navigateTo(to, { external: true })

      // If url contains a hash, the browser does not reload the page. We reload manually
      if (to.includes("#")) reloadNuxtApp({ persistState: true, force: true })
      return
    }

    return response
  } catch (error) {
    auth.value = { loggedIn: false, user: null }
    throw error
  }
}

export interface SignOutParams<R extends boolean = true> {
  /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
  callbackUrl?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * ```ts
 * import { signOut } from "@auth/nuxt/client"
 * signOut()
 * ```
 */
export async function signOut(options?: SignOutParams) {
  const { auth } = useAuth()
  try {
    auth.value = { loggedIn: false, user: null }
    const { callbackUrl = window.location.href } = options ?? {}
    const { basePath } = useRuntimeConfig().public.authJs

    const { csrfToken } = await $fetch<{ csrfToken: string }>(
      `${basePath}/csrf`
    )
    if (!csrfToken) throw new Error("CSRF token not found")

    const data = await $fetch<{ url: string }>(`${basePath}/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl,
      }),
    })

    // Remove the session
    useAuth().removeSession()

    // Navigate back to where we were
    const url = data?.url ?? callbackUrl
    // navigateTo doesn't accept force
    await useRouter().push({ path: new URL(url).pathname, force: true })

    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) reloadNuxtApp({ persistState: true })
  } catch (error) {
    auth.value = { loggedIn: false, user: null }
    throw error
  }
}

export async function getProviders() {
  const { basePath } = useRuntimeConfig().public.authJs
  return $fetch<Record<string, Provider>[]>(`${basePath}/providers`)
}
