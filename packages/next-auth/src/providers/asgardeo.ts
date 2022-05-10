import type { OAuthConfig, OAuthUserConfig } from "."

export interface AsgardeoProfile {
  sub: string
  given_name: string
  email: string
  picture: string
}

export default function Asgardeo<P extends Record<string, any> = AsgardeoProfile>(
  options: OAuthUserConfig<P> & {
    issuer: string
  }
): OAuthConfig<P> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    type: "oauth",
    wellKnown: `${options?.issuer}/oauth2/token/.well-known/openid-configuration`,
    authorization: {
      params: { scope: "openid email profile" }
    },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile?.sub,
        name: profile?.given_name,
        email: profile?.email,
        image: profile?.picture
      }
    },
    options,
  }
}
