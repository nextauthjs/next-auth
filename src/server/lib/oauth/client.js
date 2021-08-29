import { Issuer } from "openid-client"

/**
 * NOTE: We can add auto discovery of the provider's endpoint
 * that requires only one endpoint to be specified by the user.
 * Check out `Issuer.discover`
 *
 * Client supporting OAuth 2.x and OIDC
 * @param {import("src/lib/types").InternalOptions} options
 */
export async function openidClient(options) {
  /** @type {import("src/providers").OAuthConfig} */
  const provider = options.provider

  let issuer
  if (provider.wellKnown) {
    issuer = await Issuer.discover(provider.wellKnown)
  } else {
    issuer = new Issuer({
      issuer: provider.issuer,
      authorization_endpoint:
        provider.authorization.url ?? provider.authorization,
      token_endpoint: provider.token.url ?? provider.token,
      userinfo_endpoint: provider.userinfo.url ?? provider.userinfo,
    })
  }

  const client = new issuer.Client({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uris: [provider.callbackUrl],
  })

  return client
}
