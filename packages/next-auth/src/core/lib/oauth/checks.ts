import {
  AuthorizationParameters,
  generators,
  OpenIDCallbackChecks,
} from "openid-client"
import * as jwt from "../../../jwt"

import type { RequestInternal } from "../.."
import type { OAuthChecks } from "../../../providers"
import type { CookiesOptions, InternalOptions } from "../../types"
import type { Cookie } from "../cookie"

/** Returns a signed cookie. */
export async function signCookie(
  type: keyof CookiesOptions,
  value: string,
  maxAge: number,
  options: InternalOptions<"oauth">
): Promise<Cookie> {
  const { cookies, logger } = options

  logger.debug(`CREATE_${type.toUpperCase()}`, { value, maxAge })

  const expires = new Date()
  expires.setTime(expires.getTime() + maxAge * 1000)
  return {
    name: cookies[type].name,
    value: await jwt.encode({ ...options.jwt, maxAge, token: { value } }),
    options: { ...cookies[type].options, expires },
  }
}

const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const PKCE_CODE_CHALLENGE_METHOD = "S256"
export const pkce = {
  async create(
    options: InternalOptions<"oauth">,
    cookies: Cookie[],
    resParams: AuthorizationParameters
  ) {
    if (!options.provider?.checks?.includes("pkce")) return
    const code_verifier = generators.codeVerifier()
    const value = generators.codeChallenge(code_verifier)
    resParams.code_challenge = value
    resParams.code_challenge_method = PKCE_CODE_CHALLENGE_METHOD

    const maxAge =
      options.cookies.pkceCodeVerifier.options.maxAge ?? PKCE_MAX_AGE

    cookies.push(
      await signCookie("pkceCodeVerifier", code_verifier, maxAge, options)
    )
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
    options: InternalOptions<"oauth">,
    checks: OAuthChecks
  ): Promise<string | undefined> {
    if (!options.provider?.checks?.includes("pkce")) return

    const codeVerifier = cookies?.[options.cookies.pkceCodeVerifier.name]

    if (!codeVerifier)
      throw new TypeError("PKCE code_verifier cookie was missing.")

    const value = (await jwt.decode({
      ...options.jwt,
      token: codeVerifier,
    })) as any

    if (!value?.value)
      throw new TypeError("PKCE code_verifier value could not be parsed.")

    resCookies.push({
      name: options.cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...options.cookies.pkceCodeVerifier.options, maxAge: 0 },
    })

    checks.code_verifier = value.value
  },
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const state = {
  async create(
    options: InternalOptions<"oauth">,
    cookies: Cookie[],
    resParams: AuthorizationParameters
  ) {
    if (!options.provider.checks?.includes("state")) return
    const value = generators.state()
    resParams.state = value
    const maxAge = options.cookies.state.options.maxAge ?? STATE_MAX_AGE
    cookies.push(await signCookie("state", value, maxAge, options))
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
    options: InternalOptions<"oauth">,
    checks: OAuthChecks
  ) {
    if (!options.provider.checks?.includes("state")) return

    const state = cookies?.[options.cookies.state.name]

    if (!state) throw new TypeError("State cookie was missing.")

    const value = (await jwt.decode({ ...options.jwt, token: state })) as any

    if (!value?.value) throw new TypeError("State value could not be parsed.")

    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options, maxAge: 0 },
    })

    checks.state = value.value
  },
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const nonce = {
  async create(
    options: InternalOptions<"oauth">,
    cookies: Cookie[],
    resParams: AuthorizationParameters
  ) {
    if (!options.provider.checks?.includes("nonce")) return
    const value = generators.nonce()
    resParams.nonce = value
    const maxAge = options.cookies.nonce.options.maxAge ?? NONCE_MAX_AGE
    cookies.push(await signCookie("nonce", value, maxAge, options))
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
    options: InternalOptions<"oauth">,
    checks: OpenIDCallbackChecks
  ): Promise<string | undefined> {
    if (!options.provider?.checks?.includes("nonce")) return

    const nonce = cookies?.[options.cookies.nonce.name]
    if (!nonce) throw new TypeError("Nonce cookie was missing.")

    const value = (await jwt.decode({ ...options.jwt, token: nonce })) as any

    if (!value?.value) throw new TypeError("Nonce value could not be parsed.")

    resCookies.push({
      name: options.cookies.nonce.name,
      value: "",
      options: { ...options.cookies.nonce.options, maxAge: 0 },
    })

    checks.nonce = value.value
  },
}
