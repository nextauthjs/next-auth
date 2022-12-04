import type { OAuthConfig, OAuthUserConfig } from "."

export interface AsgardeoProfile {
  sub: string
  given_name: string
  email: string
  picture: string
}

export default function Asgardeo<P extends Record<string, any> = AsgardeoProfile>(
  options: OAuthUserConfig<P>
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
    idToken: true,
    profile(profile) {
      return {
        id: profile?.sub,
        name: profile?.given_name,
        email: profile?.email,
        image: profile?.picture
      }
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/asgardeo.svg",
      logoDark:
        "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/asgardeo-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options,
  }
}
