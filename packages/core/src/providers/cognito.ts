import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface CognitoProfile extends Record<string, any> {
  sub: string
  name: string
  email: string
  picture: string
}

export default function Cognito<P extends CognitoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "cognito",
    name: "Cognito",
    type: "oidc",
    style: {
      logo: "/cognito.svg",
      logoDark: "/cognito.svg",
      bg: "#fff",
      text: "#C17B9E",
      bgDark: "#fff",
      textDark: "#C17B9E",
    },
    options,
  }
}
