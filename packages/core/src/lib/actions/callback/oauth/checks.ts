import * as o from "oauth4webapi"
import { InvalidCheck } from "../../../../errors.js"

// NOTE: We use the default JWT methods here because they encrypt the payload by default.
import * as encryptedJWT from "../../../../jwt.js"

import type {
  CookiesOptions,
  InternalOptions,
  RequestInternal,
  User,
} from "../../../../types.js"
import type { Cookie } from "../../../utils/cookie.js"
import type { WebAuthnProviderType } from "../../../../providers/webauthn.js"

/** Returns a cookie with a JWT encrypted payload. */
export async function createCookie<P extends string | Record<string, any>>(
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

  const encoded = await encryptedJWT.encode({
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
    const cookie = await createCookie<PKCEPayload>(
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

    const payload = await encryptedJWT.decode<PKCEPayload>({
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
  origin: string
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

    const random = o.generateRandomState()
    const cookie = await createCookie<StatePayload | string>(
      "state",
      origin ? { origin, random } : random,
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

    const state = cookies?.[options.cookies.state.name]

    if (!state) throw new InvalidCheck("State cookie was missing")

    // Clear the state cookie after use
    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options, maxAge: 0 },
    })

    return state
  },
  /** Parses the state. If it could not be parsed, it returns `null`. */
  async parse(state: string, options: InternalOptions) {
    const { logger, cookies } = options
    try {
      // IDEA: Let the user pass their own payload?
      return encryptedJWT.decode<StatePayload>({
        ...options.jwt,
        token: state,
        salt: cookies.state.name,
      })
    } catch (error) {
      logger.error(new TypeError("State could not be parsed", { cause: error }))
      return null
    }
  },
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
type NoncePayload = string
export const nonce = {
  async create(options: InternalOptions<"oidc">) {
    if (!options.provider.checks.includes("nonce")) return
    const maxAge = NONCE_MAX_AGE
    const value = o.generateRandomNonce()
    const cookie = await createCookie<NoncePayload>(
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

    const value = await encryptedJWT.decode<NoncePayload>({
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
      cookie: await createCookie<WebAuthnChallengePayload>(
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

    const payload = await encryptedJWT.decode<WebAuthnChallengePayload>({
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
