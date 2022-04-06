import { discoveryRequest, processDiscoveryResponse } from "@panva/oauth4webapi"

import type { AuthorizationServer } from "@panva/oauth4webapi"
import type { InternalProvider } from "src/lib/types"

export default async function getAuthorizationServer(
  provider: InternalProvider<"oauth">
): Promise<AuthorizationServer> {
  if (provider.idToken) {
    const issuer = new URL(provider.issuer as string)
    return await discoveryRequest(issuer).then(
      async (response) => await processDiscoveryResponse(issuer, response)
    )
  } else {
    return {
      issuer: provider.issuer as string,
      authorization_endpoint:
        typeof provider.authorization === "string"
          ? provider.authorization
          : provider.authorization?.url,
      token_endpoint:
        typeof provider.token === "string"
          ? provider.token
          : provider.token?.url,
      userinfo_endpoint:
        typeof provider.userinfo === "string"
          ? provider.userinfo
          : provider.userinfo?.url,
      jwks_uri: provider.jwks_uri,
    }
  }
}
