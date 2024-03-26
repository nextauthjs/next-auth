import { base } from "$app/paths"
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"

import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"
import type { WebAuthnOptionsResponseBody } from "@auth/core/types"
import type { SignInOptions, SignInAuthorizationParams } from "./client.js"
import type { LiteralUnion } from "./types.js"

/**
 * Fetch webauthn options from server and prompt user for authentication or registration.
 * Returns either the completed WebAuthn response or an error request.
 *
 * @param providerId provider ID
 * @param options SignInOptions
 * @returns WebAuthn response or error
 */
async function webAuthnOptions(providerId: string, options?: SignInOptions) {
  const baseUrl = `${base}/auth/`

  // @ts-expect-error
  const params = new URLSearchParams(options)

  const optionsResp = await fetch(
    `${baseUrl}/webauthn-options/${providerId}?${params}`
  )
  if (!optionsResp.ok) {
    return { error: optionsResp }
  }
  const optionsData: WebAuthnOptionsResponseBody = await optionsResp.json()

  if (optionsData.action === "authenticate") {
    const webAuthnResponse = await startAuthentication(optionsData.options)
    return { data: webAuthnResponse, action: "authenticate" }
  } else {
    const webAuthnResponse = await startRegistration(optionsData.options)
    return { data: webAuthnResponse, action: "register" }
  }
}

/**
 * Client-side method to initiate a webauthn signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://authjs.dev/reference/sveltekit/client#signin)
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials"
  const isEmail = providerId === "email"
  const isWebAuthn = providerId === "webauthn"
  const isSupportingReturn = isCredentials || isEmail || isWebAuthn

  const basePath = base ?? ""
  const signInUrl = `${basePath}/auth/${
    isCredentials || isWebAuthn ? "callback" : "signin"
  }/${providerId}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  // Execute WebAuthn client flow if needed
  const webAuthnBody: Record<string, unknown> = {}
  if (isWebAuthn) {
    const { data, error, action } = await webAuthnOptions(providerId, options)
    if (error) {
      // logger.error(new Error(await error.text()))
      return
    }
    webAuthnBody.data = JSON.stringify(data)
    webAuthnBody.action = action
  }

  // TODO: Remove this since Sveltekit offers the CSRF protection via origin check
  const csrfTokenResponse = await fetch(`${basePath}/auth/csrf`)
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
      ...webAuthnBody,
    }),
  })

  const data = await res.clone().json()

  if (redirect || !isSupportingReturn) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? callbackUrl
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes("#")) window.location.reload()
    return
  }

  return res
}
