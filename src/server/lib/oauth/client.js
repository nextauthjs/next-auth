import { Issuer } from "openid-client"

/**
 * NOTE: We can add auto discovery of the provider's endpoint
 * that requires only one endpoint to be specified by the user.
 * Check out `Issuer.discover`
 *
 * Client supporting OAuth 2.x and OIDC
 * @param {import("types/internals").InternalOptions} options
 */
export function openidClient(options) {
  /** @type {import("types/providers").OAuthConfig} */
  const provider = options.provider

  const authorization_endpoint =
    typeof provider.authorization === "string"
      ? provider.authorization
      : provider.authorization.url

  const token_endpoint =
    typeof provider.token === "string" ? provider.token : provider.token.url

  const issuer = new Issuer({
    issuer: provider.issuer,
    authorization_endpoint,
    token_endpoint,
    userinfo_endpoint: provider.profileUrl,
    jwks_uri: provider.jwks_uri,
  })

  const client = new issuer.Client({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uris: [provider.callbackUrl],
  })

  return client
}
