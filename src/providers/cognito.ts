import type { OAuthConfig, OAuthUserConfig } from "."

export interface CognitoProfile {
  sub: string
  name: string
  email: string
  picture: string
}

export default function Cognito<P extends Record<string, any> = CognitoProfile>(
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
    options,
  }
}
