import type { OAuthConfig, OAuthUserConfig } from "."

interface AtlassianProfile extends Record<string, any> {
  account_id: string
  name: string
  email: string
  picture: string
}

export default function Atlassian<P extends AtlassianProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "atlassian",
    name: "Atlassian",
    type: "oauth",
    authorization: {
      url: "https://auth.atlassian.com/authorize",
      params: {
        audience: "api.atlassian.com",
        prompt: "consent",
      },
    },
    token: "https://auth.atlassian.com/oauth/token",
    userinfo: "https://api.atlassian.com/me",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
