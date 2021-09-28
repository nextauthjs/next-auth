import { OAuthConfig, OAuthUserConfig } from "."

export interface KeycloakProfile {
  exp: number
  iat: number
  auth_time: number
  jti: string
  iss: string
  aud: string
  sub: string
  typ: string
  azp: string
  session_state: string
  at_hash: string
  acr: string
  sid: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
  picture: string
  user: any
}

export default function Keycloak<
  P extends Record<string, any> = KeycloakProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "keycloak",
    name: "Keycloak",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
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
