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

interface CookiePayload {
  value: string
}

/** Returns a cookie with a JWT encrypted payload. */
async function sealCookie(
  type: keyof CookiesOptions,
  payload: string,
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
    token: { value: payload } satisfies CookiePayload,
    salt: name,
  })
  const cookieOptions = { ...cookies[type].options, expires }
  return { name, value: encoded, options: cookieOptions }
}

async function parseCookie(
  name: keyof CookiesOptions,
  cookie: string | undefined,
  options: InternalOptions
): Promise<string> {
  try {
    options.logger.debug(`PARSE_${name.toUpperCase()}`, { cookie })

    if (!cookie) throw new InvalidCheck(`${name} cookie was missing`)
    const parsed = await encryptedJWT.decode<CookiePayload>({
      ...options.jwt,
      token: cookie,
      salt: options.cookies[name].name,
    })
    if (parsed?.value) return parsed.value
    throw new InvalidCheck(`${name} value could not be parsed`)
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
  resCookies.push({
    name: options.cookies[name].name,
    value: "",
    options: { ...options.cookies[name].options, maxAge: 0 },
  })
}

const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

export const pkce = {
  async create(options: InternalOptions<"oauth">) {
    const code_verifier = o.generateRandomCodeVerifier()
    const cookie = await sealCookie(
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

    const cookieValue = cookies?.[options.cookies.pkceCodeVerifier.name]
    const parsed = await parseCookie("pkceCodeVerifier", cookieValue, options)

    clearCookie("pkceCodeVerifier", options, resCookies)

    return parsed
  },
}

interface EncodedState {
  origin?: string
  random: string
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
const encodedStateSalt = "encodedState"
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

    // IDEA: Allow the user to pass data to be stored in the state
    const payload = {
      origin,
      random: o.generateRandomState(),
    } satisfies EncodedState

    const value = await encryptedJWT.encode({
      secret: options.jwt.secret,
      token: payload,
      salt: encodedStateSalt,
      maxAge: STATE_MAX_AGE,
    })

    const cookie = await sealCookie("state", value, STATE_MAX_AGE, options)
    return { cookie, value }
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

    const cookieValue = cookies?.[options.cookies.state.name]
    const parsed = await parseCookie("state", cookieValue, options)

    clearCookie("state", options, resCookies)

    return parsed
  },
  /** Decodes the state. If it could not be decoded, it returns `null`. */
  async decode(state: string, options: InternalOptions) {
    try {
      options.logger.debug("DECODE_STATE", { state })
      return await encryptedJWT.decode<EncodedState>({
        secret: options.jwt.secret,
        token: state,
        salt: encodedStateSalt,
      })
    } catch (error) {
      throw new InvalidCheck("State could not be decoded", { cause: error })
    }
  },
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

export const nonce = {
  async create(options: InternalOptions<"oidc">) {
    if (!options.provider.checks.includes("nonce")) return
    const maxAge = NONCE_MAX_AGE
    const value = o.generateRandomNonce()
    const cookie = await sealCookie("nonce", value, maxAge, options)
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

    const cookieValue = cookies?.[options.cookies.nonce.name]
    const parsed = await parseCookie("nonce", cookieValue, options)

    clearCookie("nonce", options, resCookies)

    return parsed
  },
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
        await encryptedJWT.encode({
          secret: options.jwt.secret,
          token: { challenge, registerData } satisfies WebAuthnChallengePayload,
          salt: webauthnChallengeSalt,
          maxAge: WEBAUTHN_CHALLENGE_MAX_AGE,
        }),
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
    const cookieValue = cookies?.[options.cookies.webauthnChallenge.name]

    const parsed = await parseCookie("webauthnChallenge", cookieValue, options)

    const payload = await encryptedJWT.decode<WebAuthnChallengePayload>({
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
