/**
 * <div class="provider" style={{backgroundColor: "#ff90e8", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>Gumroad</b> integration.</span>
 * <a href="https://gumroad.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/gumroad.svg" height="48" width="48" />
 * </a>
 * </div>
 *
 * @module providers/gumroad
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface GumroadProfile {
  success: boolean
  user: {
    id: string
    email: string
    name: string
    display_name?: string
    bio?: string
    twitter_handle?: string
    facebook_profile?: string
    url?: string
    profile_url?: string
  }
}

/**
 * Add Gumroad login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/gumroad
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Gumroad from "@auth/core/providers/gumroad"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Gumroad({
 *       clientId: AUTH_GUMROAD_ID,
 *       clientSecret: AUTH_GUMROAD_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Gumroad OAuth documentation](https://gumroad.com/api)
 * - [Gumroad OAuth application setup](https://app.gumroad.com/settings/advanced#application-form)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Gumroad provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Gumroad provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/gumroad.ts).
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
export default function Gumroad(
  config: OAuthUserConfig<GumroadProfile>
): OAuthConfig<GumroadProfile> {
  return {
    id: "gumroad",
    name: "Gumroad",
    type: "oauth",
    authorization: "https://gumroad.com/oauth/authorize?scope=view_profile",
    token: "https://api.gumroad.com/oauth/token",
    userinfo: "https://api.gumroad.com/v2/user",
    profile(profile) {
      return {
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        image: profile.user.profile_url,
      }
    },
    options: config,
  }
}
