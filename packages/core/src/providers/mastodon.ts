/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Mastodon</b> integration.</span>
 * <a href="https://mastodon.social">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mastodon.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/mastodon
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface MastodonProfile extends Record<string, any> {
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
  last_status_at: string | null
}

/**
 * Add Mastodon login to your page.
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
 * import Mastodon from "@auth/core/providers/mastodon"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Mastodon({ clientId: MASTODON_CLIENT_ID, clientSecret: MASTODON_CLIENT_SECRET, issuer: MASTODON_ISSUER })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Mastodon OAuth documentation](https://docs.joinmastodon.org/client/token/)
 *  - [Mastodon OAuth Configuration](https://mastodon.social/settings/applications)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Mastodon provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * Due to Mastodons infrastructure beeing a Fediverse you have to define the `issuer` you want to connect to.
 *
 * :::tip
 *
 * The Mastodon provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/mastodon.ts).
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

export default function Mastodon<P extends MastodonProfile>(
  options: OAuthUserConfig<P> & {
    issuer: string
  }
): OAuthConfig<P> {
  return {
    id: "mastodon",
    name: "Mastodon",
    type: "oauth",
    authorization: `${options.issuer}/oauth/authorize?scope=read`,
    token: `${options.issuer}/oauth/token`,
    userinfo: `${options.issuer}/api/v1/accounts/verify_credentials`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        image: profile.avatar_static,
        email: null,
      }
    },
    options,
  }
}
