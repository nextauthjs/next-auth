import type { OAuthConfig, OAuthUserConfig } from "."

export interface BoxyHQSAMLProfile extends Record<string, any> {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export default function SAMLJackson<P extends BoxyHQSAMLProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "boxyhq-saml",
    name: "BoxyHQ SAML",
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
        email: profile.email,
        name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
        image: null,
      }
    },
    options,
  }
}
