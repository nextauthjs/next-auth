import type { OAuthConfig, OAuthUserConfig } from "."

export default function Atlassian<P extends {}>(
  options: OAuthUserConfig<P> & {
    domain: string
    tenantId: string
    scopes?: string
  }
): OAuthConfig<P> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    clientId: options?.clientId,
    clientSecret: options?.clientSecret,
    type: "oauth",
    wellKnown: `https://${options.domain}/t/${options?.tenantId}/oauth2/token/.well-known/openid-configuration`,
    authorization: {
      params: { scope: options?.scopes || "openid email profile internal_login" } 
    },
    token: `https://${options?.domain}/t/${options?.tenantId}/oauth2/token`,
    userinfo: `https://${options?.domain}/t/${options?.tenantId}/scim2/Me`,
    idToken: true,
    checks: ["pkce", "state"],
    options,
  }
}
