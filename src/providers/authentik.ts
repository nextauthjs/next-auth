import type { OAuthConfig, OAuthUserConfig } from "."

export interface AuthentikProfile {
  iss: string,
  sub: string,
  aud: string,
  exp: number,
  iat: number,
  auth_time: number,
  acr: string,
  c_hash: string,
  nonce: string,
  at_hash: string,
  email: string,
  email_verified: boolean,
  name: string,
  given_name: string,
  family_name: string,
  preferred_username: string,
  nickname: string,
  groups: string[]
}

export default function Authentik<
  P extends Record<string, any> = AuthentikProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "authentik",
    name: "Authentik",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
