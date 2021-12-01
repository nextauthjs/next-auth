import type { OAuthConfig, OAuthUserConfig } from "."

export interface OsuUserCompact {
  avatar_url: string
  country_code: string
  default_group: string
  id: string
  is_active: boolean
  is_bot: boolean
  is_deleted: boolean
  is_online: boolean
  is_supporter: boolean
  last_visit: Date | null
  pm_friends_only: boolean
  profile_colour: string | null
  username: string
}

export interface OsuProfile extends OsuUserCompact {
  discord: string | null
  has_supported: boolean
  interests: string | null
  join_date: Date
  kudosu: {
    available: number
    total: number
  }
  location: string | null
  max_blocks: number
  max_friends: number
  occupation: string | null
  playmode: string
  playstyle: string[]
  post_count: number
  profile_order: string[]
  title: string | null
  title_url: string | null
  twitter: string | null
  website: string | null
  country: {
    code: string
    name: string
  }
  cover: {
    custom_url: string | null
    url: string
    id: number | null
  }
  is_restricted: boolean
}

export default function Osu<P extends Record<string, any> = OsuProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "osu",
    name: "Osu!",
    type: "oauth",
    token: "https://osu.ppy.sh/oauth/token",
    authorization: {
      url: "https://osu.ppy.sh/oauth/authorize",
      params: {
        scope: "identify",
      },
    },
    userinfo: "https://osu.ppy.sh/api/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        email: null,
        name: profile.username,
        image: profile.avatar_url,
      }
    },
    options,
  }
}
