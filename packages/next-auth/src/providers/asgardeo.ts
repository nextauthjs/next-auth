import type { OAuthConfig, OAuthUserConfig } from "."

export interface AsgardeoProfile {
  sub: string
  name: string
  email: string
}

export default function Asgardeo<P extends Record<string, any> = AsgardeoProfile>(
  options: OAuthUserConfig<P> & {
    organization: string
    scopes?: string
  }
): OAuthConfig<P> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    type: "oauth",
    wellKnown: `https://api.asgardeo.io/t/${options?.organization}/oauth2/token/.well-known/openid-configuration`,
    authorization: {
      params: { scope: options?.scopes || "openid email profile" } 
    },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile?.sub,
        name: profile?.given_name,
        email: profile?.email
      }
    },
    options,
  }
}
