import type { OAuthConfig, OAuthUserConfig } from "./index.js"

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
    type: "oidc",
    style: {
      logo: "/auth0.svg",
      logoDark: "/auth0-dark.svg",
      bg: "#fff",
      text: "#EB5424",
      bgDark: "#EB5424",
      textDark: "#fff",
    },
    options,
  }
}
