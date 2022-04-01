import { InternalProvider } from "src/lib/types"
import { Client } from "@panva/oauth4webapi"

/**
 * NOTE: We can add auto discovery of the provider's endpoint
 * that requires only one endpoint to be specified by the user.
 * Check out `Issuer.discover`
 *
 * Client supporting OAuth 2.x and OIDC
 */
export function openidClient(provider: InternalProvider<"oauth">): Client {
  return {
    client_id: provider.clientId as string,
    client_secret: provider.clientSecret as string,
    token_endpoint_auth_method: "client_secret_basic",
    ...provider.client,
  }
}
