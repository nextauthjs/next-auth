import * as o from "oauth4webapi"
import * as jwt from "../../jwt.js"

import type {
  InternalOptions,
  RequestInternal,
  CookiesOptions,
} from "../../types.js"
import type { Cookie } from "../cookie.js"

import { InvalidState } from "../../errors.js"

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
export const pkce = {
  async create(options: InternalOptions<"oauth">) {
    const code_verifier = o.generateRandomCodeVerifier()
    const value = await o.calculatePKCECodeChallenge(code_verifier)
    const maxAge = PKCE_MAX_AGE
    const cookie = await signCookie(
      "pkceCodeVerifier",
      code_verifier,
      maxAge,
      options
    )
    return { cookie, value }
  },

  /**
   * Returns code_verifier if provider uses PKCE,
   * and clears the container cookie afterwards.
   */
  async use(
    codeVerifier: string | undefined,
    options: InternalOptions<"oauth">
  ): Promise<{ codeVerifier: string; cookie: Cookie } | undefined> {
    const { cookies, provider } = options

    if (!provider?.checks?.includes("pkce") || !codeVerifier) {
      return
    }

    const pkce = (await jwt.decode({
      ...options.jwt,
      token: codeVerifier,
    })) as any

    return {
      codeVerifier: pkce?.value ?? undefined,
      cookie: {
        name: cookies.pkceCodeVerifier.name,
        value: "",
        options: { ...cookies.pkceCodeVerifier.options, maxAge: 0 },
      },
    }
  },
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const state = {
  async create(options: InternalOptions<"oauth">) {
    if (!options.provider.checks.includes("state")) return
    // TODO: support customizing the state
    const value = o.generateRandomState()
    const maxAge = STATE_MAX_AGE
    const cookie = await signCookie("state", value, maxAge, options)
    return { cookie, value }
  },
  /**
   * Returns state from the saved cookie
   * if the provider supports states,
   * and clears the container cookie afterwards.
   */
  async use(
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[],
    options: InternalOptions<"oauth">
  ): Promise<string | undefined> {
    const { provider, jwt } = options
    if (!provider.checks.includes("state")) return

    const state = cookies?.[options.cookies.state.name]

    if (!state) throw new InvalidState("State was missing from the cookies.")

    // IDEA: Let the user do something with the returned state
    const value = (await jwt.decode({ ...options.jwt, token: state })) as any

    if (!value?.value) throw new InvalidState("Could not parse state cookie.")

    // Clear the state cookie after use
    resCookies.push({
      name: options.cookies.state.name,
      value: "",
      options: { ...options.cookies.state.options, maxAge: 0 },
    })

    return value.value
  },
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
export const nonce = {
  async create(options: InternalOptions<"oauth">) {
    if (!options.provider.checks.includes("nonce")) return
    const value = o.generateRandomNonce()
    const maxAge = NONCE_MAX_AGE
    const cookie = await signCookie("nonce", value, maxAge, options)
    return { cookie, value }
  },
  /**
   * Returns nonce from if the provider supports nonce,
   * and clears the container cookie afterwards.
   */
  async use(
    nonce: string | undefined,
    options: InternalOptions<"oauth">
  ): Promise<{ value: string; cookie: Cookie } | undefined> {
    const { cookies, provider } = options

    if (!provider?.checks?.includes("nonce") || !nonce) {
      return
    }

    const value = (await jwt.decode({ ...options.jwt, token: nonce })) as any

    return {
      value: value?.value ?? undefined,
      cookie: {
        name: cookies.nonce.name,
        value: "",
        options: { ...cookies.nonce.options, maxAge: 0 },
      },
    }
  },
}
