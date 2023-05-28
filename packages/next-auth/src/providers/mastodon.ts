/** @type {import(".").OAuthProvider} */

type VerifyCredentialsResponse = {
  id: string
  username: string
  acct: string
  display_name: string
  locked: boolean
  bot: boolean
  created_at: string
  note: string
  url: string
  avatar: string
  avatar_static: string
  header: string
  header_static: string
  followers_count: number
  following_count: number
  statuses_count: number
  last_status_at: string
  source: {
    privacy: string
    sensitive: boolean
    language: string
    note: string
    fields: Array<{
      name: string
      value: string
      verified_at: string
    }>
    follow_requests_count: number
  }
  emojis: Array<{
    shortcode: string
    static_url: string
    url: string
    visible_in_picker: boolean
  }>
  fields: Array<{
    name: string
    value: string
    verified_at: null | string
  }>
}

export default function Mastodon(options) {
  return {
    id: "mastodon",
    name: "Mastodon",
    type: "oauth",
    authorization: "https://mastodon.example/api/v1/apps",
    token: "https://mastodon.example/oauth/token",
    userinfo: "https://mastodon.example/api/v1/accounts/verify_credentials",
    profile(profile: VerifyCredentialsResponse) {
      return {
        id: profile.id,
        username: profile.username,
        acct: profile.acct,
        display_name: profile.display_name,
        locked: profile.locked,
        bot: profile.bot,
        created_at: profile.created_at,
        note: profile.note,
        url: profile.url,
        avatar: profile.avatar,
        avatar_static: profile.avatar_static,
        header: profile.header,
        header_static: profile.header_static,
        followers_count: profile.followers_count,
        following_count: profile.following_count,
        statuses_count: profile.statuses_count,
        last_status_at: profile.last_status_at,
        source: profile.fields,
        emojis: profile.emojis,
        fields: profile.fields,
      }
    },
    options,
  }
}
