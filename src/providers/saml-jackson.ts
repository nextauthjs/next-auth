import type { OAuthConfig, OAuthUserConfig } from "."

export interface SAMLJacksonProfile {
  id: string
  email: string
  name: string
  image: null
}

export default function SAMLJackson<
  P extends Record<string, any> = SAMLJacksonProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "saml-jackson",
    name: "BoxyHQ SAML Jackson",
    type: "oauth",
    version: "2.0",
    checks: ["pkce", "state"],
    authorization: {
      url: `${options.issuer}/api/oauth/authorize`,
      params: {
        provider: "saml",
      },
    },
    token: `${options.issuer}/api/oauth/token`,
    userinfo: `${options.issuer}/api/oauth/userinfo`,
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email || "",
        name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
        image: null,
      }
    },
    options,
  }
}
