import type {
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
} from "next-auth/react"
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"

export type Fetch = typeof fetch

export async function makeSignInRequest<
  P extends RedirectableProviderType | undefined = undefined
>(
  fetch: Fetch,
  fallbackCallbackUrl: string,
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = fallbackCallbackUrl, redirect: shouldRedirect = true } =
    options ?? {}

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials"
  const isEmail = providerId === "email"
  const isSupportingReturn = isCredentials || isEmail

  // TODO: Handle custom base path
  const signInUrl = `/auth/${
    isCredentials ? "callback" : "signin"
  }/${providerId}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  // TODO: Handle custom base path
  // TODO: Remove this since Sveltekit offers the CSRF protection via origin check
  const csrfTokenResponse = await fetch("/auth/csrf")
  const { csrfToken } = await csrfTokenResponse.json()

  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    // @ts-ignore
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl,
    }).toString(),
  })

  return {
    res,
    data: await res.clone().json(),
    shouldRedirect,
    isSupportingReturn,
    callbackUrl,
  }
}

export async function makeSignOutRequest(
  fetch: Fetch,
  fallbackCallbackUrl: string,
  options?: SignOutParams
) {
  const { callbackUrl = fallbackCallbackUrl } = options ?? {}
  // TODO: Custom base path
  // TODO: Remove this since Sveltekit offers the CSRF protection via origin check
  const csrfTokenResponse = await fetch("/auth/csrf")
  const { csrfToken } = await csrfTokenResponse.json()
  const res = await fetch(`/auth/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl,
    }),
  })

  return {
    data: await res.json(),
    callbackUrl,
  }
}
