import type { OAuthConfig, OAuthUserConfig } from "."

export interface TraktUser extends Record<string, any> {
  username: string
  private: boolean
  name: string
  vip: boolean
  vip_ep: boolean
  ids: { slug: string }
  joined_at: string
  location: string | null
  about: string | null
  gender: string | null
  age: number | null
  images: { avatar: { full: string } }
}

export default function Trakt<P extends TraktUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "trakt",
    name: "Trakt",
    type: "oauth",
    authorization: {
      url: "https://trakt.tv/oauth/authorize",
      params: { scope: "" }, // when default, trakt returns auth error
    },
    token: "https://api.trakt.tv/oauth/token",

    userinfo: {
      async request(context) {
        const res = await fetch("https://api.trakt.tv/users/me?extended=full", {
          headers: {
            Authorization: `Bearer ${context.tokens.access_token}`,
            "trakt-api-version": "2",
            "trakt-api-key": context.provider.clientId as string,
          },
        })

        if (res.ok) return await res.json()

        throw new Error("Expected 200 OK from the userinfo endpoint")
      },
    },
    profile(profile) {
      return {
        id: profile.ids.slug,
        name: profile.name,
        email: null, // trakt does not provide user emails
        image: profile.images.avatar.full, // trakt does not allow hotlinking
      }
    },
    options,
  }
}
