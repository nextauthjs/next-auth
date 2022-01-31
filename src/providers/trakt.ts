import { OAuthConfig, OAuthUserConfig } from "."

export interface TraktUser {
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

export default function Trakt<
  P extends Record<string, any> = TraktUser
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "trakt",
    name: "Trakt",
    type: "oauth",
    authorization: {
      url: "https://api.trakt.tv/oauth/authorize",
      params: { scope: "" }, // when default, trakt returns auth error
    },
    token: "https://api.trakt.tv/oauth/token",

    userinfo: {
      // custom data fetcher to compensate for
      // unique headers required by the trakt api
      async request(context) {
        if (!context.provider.clientId) {
          throw new Error("clientId is required")
        }

        const headers = new Headers()
        headers.set("Content-Type", "application/json")
        headers.set("Authorization", `Bearer ${context.tokens.access_token}`)
        headers.set("trakt-api-version", "2")
        headers.set("trakt-api-key", context.provider.clientId)

        const res = await fetch("https://api.trakt.tv/users/me?extended=full", {
          headers: headers,
        })

        if (res.status !== 200) {
          throw new Error("Expected 200 OK from the userinfo endpoint")
        }

        const data = await res.json()
        return data
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
