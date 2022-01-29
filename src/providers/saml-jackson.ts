import type { OAuthConfig, OAuthUserConfig } from "."

export interface SAMLJacksonProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  email_verified: boolean
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
        scope: "",
        response_type: "code",
        provider: "saml",
      },
    },
    token: {
      url: `${options.issuer}/api/oauth/token`,
      params: { grant_type: "authorization_code" },
    },
    userinfo: `${options.issuer}/api/oauth/userinfo`,
    profile(profile) {
      return {
        id: profile.id || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
        email_verified: true,
        image: null,
      }
    },
    options: {
      clientId: options.clientId || "dummy",
      clientSecret: options.clientSecret || "dummy",
    },
  }
}
