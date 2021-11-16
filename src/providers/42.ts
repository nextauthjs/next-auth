import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface FortyTwoProfile {
  id: string
  fullname: string
  email: string
  image: string
}

export default function FortyTwo<
  P extends Record<string, any> = FortyTwoProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { scope: "public" },
    },
    token: "https://api.intra.42.fr/oauth/token",
    userinfo: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.usual_full_name,
        email: profile.email,
        image: profile.image_url,
      }
    },
    options,
  }
}
