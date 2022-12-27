import type { OAuthConfig, OAuthUserConfig } from "."

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
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid email profile" } },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        preferred_username: profile.preferred_username,
        email: profile.email,
      }
    },
    checks: ["state"],
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    idToken: true,
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/beyondidentity.svg",
      logoDark:
        "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/beyondidentity-dark.svg",
      bg: "#fff",
      bgDark: "#5077c5",
      text: "#5077c5",
      textDark: "#fff",
    },
    options,
  }
}
