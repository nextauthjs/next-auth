import { Issuer } from "openid-client"

/**
 * Client supporting OAuth 2.x and OIDC
 * @param {import("types/internals").AppOptions} options
 */
export async function openidClient({ provider }) {
  const issuer = new Issuer({
    issuer: `https://${provider.domain}`,
    authorization_endpoint: provider.authorizationUrl,
    userinfo_endpoint: provider.profileUrl,
    token_endpoint: provider.accessTokenUrl,
    jwks_uri: `https://${provider.domain}/.well-known/jwks.json`,
  })

  const client = issuer.Client({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uris: [provider.callbackUrl],
  })

  return client
}
