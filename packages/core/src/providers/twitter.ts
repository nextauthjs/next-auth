// TODO: move OAuth 1.0 support or remove it?
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface TwitterLegacyProfile {
  id: number
  id_str: string
  name: string
  screen_name: string
  location: string
  description: string
  url: string
  entities: {
    url: {
      urls: Array<{
        url: string
        expanded_url: string
        display_url: string
        indices: number[]
      }>
    }
    description: {
      urls: any[]
    }
  }
  protected: boolean
  followers_count: number
  friends_count: number
  listed_count: number
  created_at: string
  favourites_count: number
  utc_offset?: any
  time_zone?: any
  geo_enabled: boolean
  verified: boolean
  statuses_count: number
  lang?: any
  status: {
    created_at: string
    id: number
    id_str: string
    text: string
    truncated: boolean
    entities: {
      hashtags: any[]
      symbols: any[]
      user_mentions: Array<{
        screen_name: string
        name: string
        id: number
        id_str: string
        indices: number[]
      }>
      urls: any[]
    }
    source: string
    in_reply_to_status_id: number
    in_reply_to_status_id_str: string
    in_reply_to_user_id: number
    in_reply_to_user_id_str: string
    in_reply_to_screen_name: string
    geo?: any
    coordinates?: any
    place?: any
    contributors?: any
    is_quote_status: boolean
    retweet_count: number
    favorite_count: number
    favorited: boolean
    retweeted: boolean
    lang: string
  }
  contributors_enabled: boolean
  is_translator: boolean
  is_translation_enabled: boolean
  profile_background_color: string
  profile_background_image_url: string
  profile_background_image_url_https: string
  profile_background_tile: boolean
  profile_image_url: string
  profile_image_url_https: string
  profile_banner_url: string
  profile_link_color: string
  profile_sidebar_border_color: string
  profile_sidebar_fill_color: string
  profile_text_color: string
  profile_use_background_image: boolean
  has_extended_profile: boolean
  default_profile: boolean
  default_profile_image: boolean
  following: boolean
  follow_request_sent: boolean
  notifications: boolean
  translator_type: string
  withheld_in_countries: any[]
  suspended: boolean
  needs_phone_verification: boolean
}

/**
 * [Documentation](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me)
 */
export interface TwitterProfile {
  data: {
    id: string
    name: string
    username: string
    location?: string
    entities?: {
      url: {
        urls: Array<{
          start: number
          end: number
          url: string
          expanded_url: string
          display_url: string
        }>
      }
      description: {
        hashtags: Array<{
          start: number
          end: number
          tag: string
        }>
      }
    }
    verified?: boolean
    description?: string
    url?: string
    profile_image_url?: string
    protected?: boolean
    pinned_tweet_id?: string
    created_at?: string
  }
  includes?: {
    tweets?: Array<{
      id: string
      text: string
    }>
  }
}

export default function Twitter<
  P extends Record<string, any> = TwitterLegacyProfile | TwitterProfile
>(options: OAuthUserConfig<P> & { version?: "2.0" }): OAuthConfig<P> {
  return {
    id: "twitter",
    name: "Twitter",
    type: "oauth",
    authorization: {
      url: "https://twitter.com/i/oauth2/authorize",
      params: { scope: "users.read tweet.read offline.access" },
    },
    token: {
      url: "https://api.twitter.com/2/oauth2/token",
      // @ts-expect-error TODO: Remove this
      async request({ client, params, checks, provider }) {
        const response = await client.oauthCallback(
          provider.callbackUrl,
          params,
          checks,
          { exchangeBody: { client_id: options.clientId } }
        )
        return { tokens: response }
      },
    },
    userinfo: {
      url: "https://api.twitter.com/2/users/me",
      params: { "user.fields": "profile_image_url" },
    },
    profile({ data }) {
      return {
        id: data.id,
        name: data.name,
        // NOTE: E-mail is currently unsupported by OAuth 2 Twitter.
        email: null,
        image: data.profile_image_url,
      }
    },
    style: {
      logo: "/twitter.svg",
      logoDark: "/twitter-dark.svg",
      bg: "#fff",
      text: "#1da1f2",
      bgDark: "#1da1f2",
      textDark: "#fff",
    },
    options,
  }
}
