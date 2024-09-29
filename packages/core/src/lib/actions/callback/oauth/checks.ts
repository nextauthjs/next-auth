import * as o from "oauth4webapi"
import { InvalidCheck } from "../../../../errors.js"

// NOTE: We use the default JWT methods here because they encrypt/decrypt the payload, not just sign it.
import { decode, encode } from "../../../../jwt.js"

import type {
  CookiesOptions,
  InternalOptions,
  RequestInternal,
  User,
} from "../../../../types.js"
import type { Cookie } from "../../../utils/cookie.js"
import type { WebAuthnProviderType } from "../../../../providers/webauthn.js"

interface CookiePayload {
  value: string
}

const COOKIE_TTL = 60 * 15 // 15 minutes

/** Returns a cookie with a JWT encrypted payload. */
async function sealCookie(
  name: keyof CookiesOptions,
  payload: string,
  options: InternalOptions<"oauth" | "oidc" | WebAuthnProviderType>
): Promise<Cookie> {
  const { cookies, logger } = options
  const cookie = cookies[name]
  const expires = new Date()
  expires.setTime(expires.getTime() + COOKIE_TTL * 1000)

  logger.debug(`CREATE_${name.toUpperCase()}`, {
    name: cookie.name,
    payload,
    COOKIE_TTL,
    expires,
  })

  const encoded = await encode({
    ...options.jwt,
    maxAge: COOKIE_TTL,
    token: { value: payload } satisfies CookiePayload,
    salt: cookie.name,
  })
  const cookieOptions = { ...cookie.options, expires }
  return { name: cookie.name, value: encoded, options: cookieOptions }
}

async function parseCookie(
  name: keyof CookiesOptions,
  value: string | undefined,
  options: InternalOptions
): Promise<string> {
  try {
    const { logger, cookies, jwt } = options
    logger.debug(`PARSE_${name.toUpperCase()}`, { cookie: value })

    if (!value) throw new InvalidCheck(`${name} cookie was missing`)
    const parsed = await decode<CookiePayload>({
      ...jwt,
      token: value,
      salt: cookies[name].name,
    })
    if (parsed?.value) return parsed.value
    throw new Error("Invalid cookie")
  } catch (error) {
    throw new InvalidCheck(`${name} value could not be parsed`, {
      cause: error,
    })
  }
}

function clearCookie(
  name: keyof CookiesOptions,
  options: InternalOptions,
  resCookies: Cookie[]
) {
  const { logger, cookies } = options
  const cookie = cookies[name]
  logger.debug(`CLEAR_${name.toUpperCase()}`, { cookie })
  resCookies.push({
    name: cookie.name,
    value: "",
    options: { ...cookies[name].options, maxAge: 0 },
  })
}

function useCookie(
  check: "state" | "pkce" | "nonce",
  name: keyof CookiesOptions
) {
  return async function (
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions<"oidc">
  ) {
    const { provider, logger } = options
    if (!provider?.checks?.includes(check)) return
    const cookieValue = cookies?.[options.cookies[name].name]
    logger.debug(`USE_${name.toUpperCase()}`, { value: cookieValue })
    const parsed = await parseCookie(name, cookieValue, options)
    clearCookie(name, options, resCookies)
    return parsed
  }
}

/**
 * @see https://www.rfc-editor.org/rfc/rfc7636
 * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#pkce
 */
export const pkce = {
  /** Creates a PKCE code challenge and verifier pair. The verifier in stored in the cookie. */
  async create(options: InternalOptions<"oauth">) {
    const code_verifier = o.generateRandomCodeVerifier()
    const value = await o.calculatePKCECodeChallenge(code_verifier)
    const cookie = await sealCookie("pkceCodeVerifier", code_verifier, options)
    return { cookie, value }
  },
  /**
   * Returns code_verifier if the provider is configured to use PKCE,
   * and clears the container cookie afterwards.
   * An error is thrown if the code_verifier is missing or invalid.
   */
  use: useCookie("pkce", "pkceCodeVerifier"),
}

interface EncodedState {
  origin?: string
  random: string
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
const encodedStateSalt = "encodedState"

/**
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-10.12
 * @see https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
 */
export const state = {
  /** Creates a state cookie with an optionally encoded body. */
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

    // IDEA: Allow the user to pass data to be stored in the state
    const payload = {
      origin,
      random: o.generateRandomState(),
    } satisfies EncodedState
    const value = await encode({
      secret: options.jwt.secret,
      token: payload,
      salt: encodedStateSalt,
      maxAge: STATE_MAX_AGE,
    })
    const cookie = await sealCookie("state", value, options)

    return { cookie, value }
  },
  /**
   * Returns state if the provider is configured to use state,
   * and clears the container cookie afterwards.
   * An error is thrown if the state is missing or invalid.
   */
  use: useCookie("state", "state"),
  /** Decodes the state. If it could not be decoded, it throws an error. */
  async decode(state: string, options: InternalOptions) {
    try {
      options.logger.debug("DECODE_STATE", { state })
      const payload = await decode<EncodedState>({
        secret: options.jwt.secret,
        token: state,
        salt: encodedStateSalt,
      })
      if (payload) return payload
      throw new Error("Invalid state")
    } catch (error) {
      throw new InvalidCheck("State could not be decoded", { cause: error })
    }
  },
}

export const nonce = {
  async create(options: InternalOptions<"oidc">) {
    if (!options.provider.checks.includes("nonce")) return
    const value = o.generateRandomNonce()
    const cookie = await sealCookie("nonce", value, options)
    return { cookie, value }
  },
  /**
   * Returns nonce if the provider is configured to use nonce,
   * and clears the container cookie afterwards.
   * An error is thrown if the nonce is missing or invalid.
   * @see https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes
   * @see https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/#nonce
   */
  use: useCookie("nonce", "nonce"),
}

const WEBAUTHN_CHALLENGE_MAX_AGE = 60 * 15 // 15 minutes in seconds

interface WebAuthnChallengePayload {
  challenge: string
  registerData?: User
}

const webauthnChallengeSalt = "encodedWebauthnChallenge"
export const webauthnChallenge = {
  async create(
    options: InternalOptions<WebAuthnProviderType>,
    challenge: string,
    registerData?: User
  ) {
    return {
      cookie: await sealCookie(
        "webauthnChallenge",
        await encode({
          secret: options.jwt.secret,
          token: { challenge, registerData } satisfies WebAuthnChallengePayload,
          salt: webauthnChallengeSalt,
          maxAge: WEBAUTHN_CHALLENGE_MAX_AGE,
        }),
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
    const cookieValue = cookies?.[options.cookies.webauthnChallenge.name]

    const parsed = await parseCookie("webauthnChallenge", cookieValue, options)

    const payload = await decode<WebAuthnChallengePayload>({
      secret: options.jwt.secret,
      token: parsed,
      salt: webauthnChallengeSalt,
    })

    // Clear the WebAuthn challenge cookie after use
    clearCookie("webauthnChallenge", options, resCookies)

    if (!payload) throw new InvalidCheck("WebAuthn challenge was missing")

    return payload
  },
}
