import type { OAuthConfig, OAuthUserConfig } from "."

export interface TwitterProfile {
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

export default function Twitter<P extends Record<string, any> = TwitterProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "twitter",
    name: "Twitter",
    type: "oauth",
    version: "1.0A",
    authorization: "https://api.twitter.com/oauth/authenticate",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token",
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    profileUrl:
      "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    profile(profile) {
      return {
        id: profile.id_str,
        name: profile.name,
        email: profile.email,
        image: profile.profile_image_url_https.replace(
          /_normal\.(jpg|png|gif)$/,
          ".$1"
        ),
      }
    },
    options,
  }
}
