import type { OAuthConfig, OAuthUserConfig } from "."

export interface Auth0Profile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

export default function Auth0<P extends Auth0Profile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "auth0",
    name: "Auth0",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
