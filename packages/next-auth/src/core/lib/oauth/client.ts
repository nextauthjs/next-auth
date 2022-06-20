import { InternalProvider } from "src/lib/types"
import type { Client as WebApiClient } from "@panva/oauth4webapi"
import { Issuer, custom } from "openid-client"
import type { Client } from "openid-client"
import type { InternalOptions } from "../../types"

/**
 * Client supporting OAuth 2.x and OIDC
 */
export function webApiClient(provider: InternalProvider<"oauth">): WebApiClient {
  return {
    client_id: provider.clientId as string,
    client_secret: provider.clientSecret as string,
    token_endpoint_auth_method: "client_secret_basic",
    ...provider.client,
  }
}
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
      authorization_endpoint:
        // @ts-expect-error
        provider.authorization?.url ?? provider.authorization,
      // @ts-expect-error
      token_endpoint: provider.token?.url ?? provider.token,
      // @ts-expect-error
      userinfo_endpoint: provider.userinfo?.url ?? provider.userinfo,
    })
  }
}
