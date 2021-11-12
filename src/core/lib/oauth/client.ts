import { Issuer, Client, custom } from "openid-client"
import { InternalOptions } from "src/lib/types"

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

  let issuer: Issuer
  if (provider.wellKnown) {
    issuer = await Issuer.discover(provider.wellKnown)
  } else {
    issuer = new Issuer({
      issuer: provider.issuer as string,
      authorization_endpoint:
        // @ts-expect-error
        provider.authorization?.url ?? provider.authorization,
      // @ts-expect-error
      token_endpoint: provider.token?.url ?? provider.token,
      // @ts-expect-error
      userinfo_endpoint: provider.userinfo?.url ?? provider.userinfo,
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

  // https://github.com/nextauthjs/next-auth/discussions/3186
  if (typeof provider.httpOptions?.timeout === "number") {
    custom.setHttpOptionsDefaults({
      timeout: provider.httpOptions.timeout,
    })
  }

  return client
}
