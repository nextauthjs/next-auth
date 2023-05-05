import { Issuer, custom } from "openid-client"
import type { Client } from "openid-client"
import type { InternalOptions } from "../../types"

/**
 * NOTE: We can add auto discovery of the provider's endpoint
 * that requires only one endpoint to be specified by the user.
 * Check out `Issuer.discover`
 *
 * Client supporting OAuth 2.x and OIDC
 */
export async function openidClient(
  options: InternalOptions<"oauth">
): Promise<Client> {
  const provider = options.provider

  if (provider.httpOptions) custom.setHttpOptionsDefaults(provider.httpOptions)

  let issuer: Issuer
  if (provider.wellKnown) {
    issuer = await Issuer.discover(provider.wellKnown)
  } else {
    issuer = new Issuer({
      issuer: provider.issuer as string,
      authorization_endpoint: provider.authorization?.url,
      token_endpoint: provider.token?.url,
      userinfo_endpoint: provider.userinfo?.url,
      jwks_uri: provider.jwks_endpoint,
    })
  }

  const client = new issuer.Client(
    {
      client_id: provider.clientId as string,
      client_secret: provider.clientSecret as string,
      redirect_uris: [provider.callbackUrl],
      ...provider.client,
    },
    provider.jwks
  )

  // allow a 10 second skew
  // See https://github.com/nextauthjs/next-auth/issues/3032
  // and https://github.com/nextauthjs/next-auth/issues/3067
  client[custom.clock_tolerance] = 10

  return client
}
