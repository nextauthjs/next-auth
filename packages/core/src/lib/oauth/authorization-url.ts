import * as o from "oauth4webapi"

import type {
  CookiesOptions,
  InternalOptions,
  RequestInternal,
  ResponseInternal,
} from "../../index.js"
import type { Cookie } from "../cookie.js"

/**
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/)
 */
export async function getAuthorizationUrl({
  options,
  query,
}: {
  options: InternalOptions<"oauth">
  query: RequestInternal["query"]
}): Promise<ResponseInternal> {
  const { logger, provider } = options

  let url = provider.authorization?.url
  let as: o.AuthorizationServer | undefined

  if (!url) {
    // If url is undefined, we assume that issuer is always defined
    // We check this in assert.ts
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const issuer = new URL(provider.issuer!)
    const discoveryResponse = await o.discoveryRequest(issuer)
    const as = await o.processDiscoveryResponse(issuer, discoveryResponse)

    if (!as.authorization_endpoint) {
      throw new TypeError(
        "Authorization server did not provide an authorization endpoint."
      )
    }

    url = new URL(as.authorization_endpoint)
  }

  const authParams = url.searchParams
  const params = Object.assign(
    {
      response_type: "code",
      // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
      client_id: provider.clientId,
      redirect_uri: provider.callbackUrl,
      // @ts-expect-error TODO:
      ...provider.authorization?.params,
    }, // Defaults
    Object.fromEntries(authParams), // From provider config
    query // From `signIn` call
  )

  for (const k in params) authParams.set(k, params[k])

  const cookies: Cookie[] = []

  if (provider.checks?.includes("state")) {
    const { value, raw } = await createState(options)
    authParams.set("state", raw)
    cookies.push(value)
  }

  if (provider.checks?.includes("pkce")) {
    if (as && !as.code_challenge_methods_supported?.includes("S256")) {
      // We assume S256 PKCE support, if the server does not advertise that,
      // a random `nonce` must be used for CSRF protection.
      provider.checks = ["nonce"]
    } else {
      const { code_challenge, pkce } = await createPKCE(options)
      authParams.set("code_challenge", code_challenge)
      authParams.set("code_challenge_method", "S256")
      cookies.push(pkce)
    }
  }

  if (provider.checks?.includes("nonce")) {
    const nonce = await createNonce(options)
    authParams.set("nonce", nonce.value)
    cookies.push(nonce)
  }

  url.searchParams.delete("nextauth")

  // TODO: This does not work in normalizeOAuth because authorization endpoint can come from discovery
  // Need to make normalizeOAuth async
  if (provider.type === "oidc" && !url.searchParams.has("scope")) {
    url.searchParams.set("scope", "openid profile email")
  }

  logger.debug("GET_AUTHORIZATION_URL", { url, cookies, provider })
  return { redirect: url, cookies }
}

/** Returns a signed cookie. */
export async function signCookie(
  type: keyof CookiesOptions,
  value: string,
  maxAge: number,
  options: InternalOptions<"oauth">
): Promise<Cookie> {
  const { cookies, jwt, logger } = options

  logger.debug(`CREATE_${type.toUpperCase()}`, { value, maxAge })

  const expires = new Date()
  expires.setTime(expires.getTime() + maxAge * 1000)
  return {
    name: cookies[type].name,
    value: await jwt.encode({ ...jwt, maxAge, token: { value } }),
    options: { ...cookies[type].options, expires },
  }
}

const STATE_MAX_AGE = 60 * 15 // 15 minutes in seconds
async function createState(options: InternalOptions<"oauth">) {
  const raw = o.generateRandomState()
  const maxAge = STATE_MAX_AGE
  const value = await signCookie("state", raw, maxAge, options)
  return { value, raw }
}

const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
async function createPKCE(options: InternalOptions<"oauth">) {
  const code_verifier = o.generateRandomCodeVerifier()
  const code_challenge = await o.calculatePKCECodeChallenge(code_verifier)
  const maxAge = PKCE_MAX_AGE
  const pkce = await signCookie(
    "pkceCodeVerifier",
    code_verifier,
    maxAge,
    options
  )
  return { code_challenge, pkce }
}

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds
async function createNonce(options: InternalOptions<"oauth">) {
  const raw = o.generateRandomNonce()
  const maxAge = NONCE_MAX_AGE
  return await signCookie("nonce", raw, maxAge, options)
}
