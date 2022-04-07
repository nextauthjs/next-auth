import { InternalProvider } from "src/lib/types"
import type { Client } from "@panva/oauth4webapi"

/**
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
