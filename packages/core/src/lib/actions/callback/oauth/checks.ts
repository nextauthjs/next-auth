import * as o from "oauth4webapi"
import { InvalidCheck } from "../../../../errors.js"
import { decode, encode } from "../../../../jwt.js"

import type {
  CookiesOptions,
  InternalOptions,
  RequestInternal,
  User,
} from "../../../../types.js"
import type { Cookie } from "../../../utils/cookie.js"
import type { OAuthConfigInternal } from "../../../../providers/oauth.js"
import type { WebAuthnProviderType } from "../../../../providers/webauthn.js"

/** Returns a signed cookie. */
export async function signCookie<P extends string | Record<string, any>>(
  type: keyof CookiesOptions,
  payload: P,
  maxAge: number,
  options: InternalOptions<"oauth" | "oidc" | WebAuthnProviderType>
): Promise<Cookie> {
  const { cookies, logger } = options
  const expires = new Date()
  expires.setTime(expires.getTime() + maxAge * 1000)
  const name = options.cookies[type].name

  logger.debug(`CREATE_${type.toUpperCase()}`, {
    name,
    payload,
    maxAge,
    expires,
  })

  const encoded = await encode({
    ...options.jwt,
    maxAge,
    token: payload,
    salt: name,
  })
  const cookieOptions = { ...cookies[type].options, expires }
  return { name, value: encoded, options: cookieOptions }
}

type PKCEPayload = string

const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const pkce = {
  async create(options: InternalOptions<"oauth">) {
    const code_verifier = o.generateRandomCodeVerifier()
    const cookie = await signCookie<PKCEPayload>(
      "pkceCodeVerifier",
      code_verifier,
      PKCE_MAX_AGE,
      options
    )
    const value = await o.calculatePKCECodeChallenge(code_verifier)
    return { cookie, value }
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   * @see https://www.rfc-editor.org/rfc/rfc7636
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#pkce
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions<"oauth">
  ): Promise<string | undefined> {
    const { provider } = options

    if (!provider?.checks?.includes("pkce")) return

    const codeVerifier = cookies?.[options.cookies.pkceCodeVerifier.name]

    if (!codeVerifier)
      throw new InvalidCheck("PKCE code_verifier cookie was missing")

    const payload = await decode<PKCEPayload>({
      ...options.jwt,
      token: codeVerifier,
      salt: options.cookies.pkceCodeVerifier.name,
    })

    if (!payload)
      throw new InvalidCheck("PKCE code_verifier value could not be parsed")

    // Clear the pkce code verifier cookie after use
    resCookies.push({
      name: options.cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...options.cookies.pkceCodeVerifier.options, maxAge: 0 },
    })

    return payload
  },
}

interface StatePayload {
  random: string
  origin?: string
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const state = {
  async create(options: InternalOptions<"oauth">, origin?: string) {
    const { provider } = options
    if (!provider.checks.includes("state")) {
      if (origin) {
        throw new InvalidCheck(
          "State data was provided but the provider is not configured to use state"
        )
      }
      return
    }

    const cookie = await signCookie<StatePayload>(
      "state",
      { origin, random: o.generateRandomState() },
      STATE_MAX_AGE,
      options
    )
    return { cookie, value: cookie.value }
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-10.12
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions<"oauth">
  ): Promise<string | undefined> {
    const { provider } = options
    if (!provider.checks.includes("state")) return

    const token = cookies?.[options.cookies.state.name]

    if (!token) throw new InvalidCheck("State cookie was missing")

    // IDEA: Let the user do something with the returned state
    const payload = await decode<StatePayload>({
      ...options.jwt,
      token,
      salt: options.cookies.state.name,
    })

    if (!payload)
      throw new InvalidCheck("State (cookie) value could not be parsed")

    // Clear the state cookie after use
    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options, maxAge: 0 },
    })

    return payload.random
  },
  /**
   * When the authorization flow contains a state, we check if it's a redirect proxy
   * and if so, we return original redirect URL.
   */
  async handleProxyRedirect(
    token: string | undefined,
    options: InternalOptions<"oauth">
  ) {
    const { cookies, logger, isOnRedirectProxy, provider } = options
    let proxyRedirect: string | undefined

    if (provider.redirectProxyUrl && !token) {
      throw new InvalidCheck(
        "Missing state in request query or body, but required for redirect proxy"
      )
    }

    const payload = await decode<StatePayload>({
      ...options.jwt,
      token,
      salt: cookies.state.name,
    })

    if (!payload) {
      throw new InvalidCheck("State param could not be parsed")
    }

    if (isOnRedirectProxy) {
      if (!payload.origin) return // Regular signin on redirect proxy
      proxyRedirect = `${payload.origin}?${new URLSearchParams(token)}`
    }

    if (proxyRedirect) logger.debug("proxy redirect", proxyRedirect)

    return proxyRedirect
  },
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
type NoncePayload = string
export const nonce = {
  async create(options: InternalOptions<"oidc">) {
    if (!options.provider.checks.includes("nonce")) return
    const maxAge = NONCE_MAX_AGE
    const value = o.generateRandomNonce()
    const cookie = await signCookie<NoncePayload>(
      "nonce",
      value,
      maxAge,
      options
    )
    return { cookie, value }
  },
  /**
   * Returns nonce if the provider is configured to use nonce,
   * and clears the container cookie afterwards.
   * An error is thrown if the nonce is missing or invalid.
   * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions<"oidc">
  ): Promise<string | undefined> {
    const { provider } = options

    if (!provider?.checks?.includes("nonce")) return

    const nonce = cookies?.[options.cookies.nonce.name]
    if (!nonce) throw new InvalidCheck("Nonce cookie was missing")

    const value = await decode<NoncePayload>({
      ...options.jwt,
      token: nonce,
      salt: options.cookies.nonce.name,
    })

    if (!value) throw new InvalidCheck("Nonce value could not be parsed")

    // Clear the nonce cookie after use
    resCookies.push({
      name: options.cookies.nonce.name,
      value: "",
      options: { ...options.cookies.nonce.options, maxAge: 0 },
    })

    return value
  },
}

const WEBAUTHN_CHALLENGE_MAX_AGE = 60 * 15 // 15 minutes in seconds

interface WebAuthnChallengePayload {
  challenge: string
  registerData?: User
}

export const webauthnChallenge = {
  async create(
    options: InternalOptions<WebAuthnProviderType>,
    challenge: string,
    registerData?: User
  ) {
    return {
      cookie: await signCookie<WebAuthnChallengePayload>(
        "webauthnChallenge",
        { challenge, registerData },
        WEBAUTHN_CHALLENGE_MAX_AGE,
        options
      ),
    }
  },
  /** Returns WebAuthn challenge if present. */
  async use(
    options: InternalOptions<WebAuthnProviderType>,
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[]
  ): Promise<WebAuthnChallengePayload> {
    const token = cookies?.[options.cookies.webauthnChallenge.name]

    if (!token) throw new InvalidCheck("WebAuthn challenge cookie missing")

    const payload = await decode<WebAuthnChallengePayload>({
      ...options.jwt,
      token,
      salt: options.cookies.webauthnChallenge.name,
    })

    if (!payload)
      throw new InvalidCheck("WebAuthn challenge could not be parsed")

    // Clear the WebAuthn challenge cookie after use
    resCookies.push({
      name: options.cookies.webauthnChallenge.name,
      value: "",
      options: { ...options.cookies.webauthnChallenge.options, maxAge: 0 },
    })

    return payload
  },
}
