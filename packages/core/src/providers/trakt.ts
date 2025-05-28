/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Trakt</b> integration.</span>
 * <a href="https://www.trakt.tv/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/trakt.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/trakt
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

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

/**
 * Add Trakt login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/trakt
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Trakt from "@auth/core/providers/trakt"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Trakt({ clientId: TRAKT_CLIENT_ID, clientSecret: TRAKT_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Trakt OAuth documentation](https://trakt.docs.apiary.io/#reference/authentication-oauth)
 *
 * If you're using the api in production by calling `api.trakt.tv`. Follow the example. If you wish to develop on Trakt's sandbox environment by calling `api-staging.trakt.tv`, change the URLs.
 *
 * Start by creating an OAuth app on Trakt for production or development. Then set the Client ID and Client Secret as TRAKT_ID and TRAKT_SECRET in .env.
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Trakt provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::danger
 *
 * - Trakt does not allow hotlinking images. Even the authenticated user's profile picture.
 * - Trakt does not supply the authenticated user's email.
 *
 * :::
 *
 * :::tip
 *
 * The Trakt provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/trakt.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function Trakt<P extends TraktUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "trakt",
    name: "Trakt",
    type: "oauth",
    authorization: "https://trakt.tv/oauth/authorize?scope=",
    token: "https://api.trakt.tv/oauth/token",
    userinfo: {
      url: "https://api.trakt.tv/users/me?extended=full",
      async request({ tokens, provider }) {
        return await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "trakt-api-version": "2",
            "trakt-api-key": provider.clientId,
          },
        }).then(async (res) => await res.json())
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
    style: { bg: "#ED2224", text: "#fff" },
    options,
  }
}
