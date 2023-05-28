/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>mastodon</b> integration.</span>
 * <a href="https://mastodon.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mastodon.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/mastodon
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add mastodon login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/mastodon
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import mastodon from "@auth/core/providers/mastodon"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [mastodon({ clientId: mastodon_CLIENT_ID, clientSecret: mastodon_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [mastodon OAuth documentation](https://example.com)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the mastodon provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::warning
 *
 * Email address is not returned by the mastodon API.
 *
 * :::
 *
 * :::tip
 *
 * The mastodon provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/mastodon.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
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

export default function mastodon(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
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
    options: config,
  }
}
