import type { OAuthConfig, OAuthUserConfig } from "."

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
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/cognito.svg",
      logoDark:
        "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/cognito.svg",
      bg: "#fff",
      text: "#C17B9E",
      bgDark: "#fff",
      textDark: "#C17B9E",
    },
    options,
  }
}
