import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface KeycloakProfile extends Record<string, any> {
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

export default function Keycloak<P extends KeycloakProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "keycloak",
    name: "Keycloak",
    type: "oidc",
    style: {
      logo: "/keycloak.svg",
      logoDark: "/keycloak.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#fff",
      textDark: "#000",
    },
    options,
  }
}
