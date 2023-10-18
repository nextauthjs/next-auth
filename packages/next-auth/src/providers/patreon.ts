import type { OAuthConfig, OAuthUserConfig } from "."

export interface PatreonProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

export default function Patreon<P extends PatreonProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "patreon",
    name: "Patreon",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://www.patreon.com/oauth2/authorize",
      params: { scope: "identity identity[email]" },
    },
    token: "https://www.patreon.com/api/oauth2/token",
    userinfo: "https://www.patreon.com/api/oauth2/api/current_user",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.attributes.full_name,
        email: profile.data.attributes.email,
        image: profile.data.attributes.image_url,
      }
    },
    style: { logo: "/patreon.svg", bg: "#e85b46", text: "#fff" },
    options,
  }
}
