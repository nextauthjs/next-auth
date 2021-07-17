import type { OAuthConfig } from "./../../types/providers.d"

interface DefaultFortyTwoProfile {
  id: string
  email: string
  image_url: string
  usual_full_name: string
}

type FortyTwoConfig = Partial<OAuthConfig<DefaultFortyTwoProfile>>

export default function FortyTwo(options?: FortyTwoConfig): FortyTwoConfig {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.intra.42.fr/oauth/token",
    authorizationUrl:
      "https://api.intra.42.fr/oauth/authorize?response_type=code",
    profileUrl: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        image: profile.image_url,
        name: profile.usual_full_name,
      }
    },
    ...options,
  }
}
