import { Issuer, custom } from "openid-client"
import type { Client } from "openid-client"
import type { InternalOptions } from "../../types"

/** Node.js reliant client supporting OAuth 2.x and OIDC */
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
      // We verify that either `issuer` or the other endpoints
      // are always defined in assert.ts
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      issuer: provider.issuer!,
      authorization_endpoint: provider.authorization?.url.toString(),
      token_endpoint: provider.token?.url.toString(),
      userinfo_endpoint: provider.userinfo?.url.toString(),
    })
  }

  const client = new issuer.Client(
    {
      // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
      client_id: provider.clientId,
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
