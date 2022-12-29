import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface BeyondIdentityProfile extends Record<string, any> {
  sub: string
  name: string
  preferred_username: string
  email: string
}

export default function BeyondIdentity<P extends BeyondIdentityProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "beyondidentity",
    name: "Beyond Identity",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        preferred_username: profile.preferred_username,
        email: profile.email,
      }
    },
    checks: ["pkce"],
    style: {
      logo: "/beyondidentity.svg",
      logoDark: "/beyondidentity-dark.svg",
      bg: "#fff",
      bgDark: "#5077c5",
      text: "#5077c5",
      textDark: "#fff",
    },
    options,
  }
}
