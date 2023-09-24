/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Pinterest</b> integration.</span>
 * <a href="https://www.pinterest.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/pinterest.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/pinterest
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface PinterestProfile extends Record<string, any> {
  account_type: "BUSINESS" | "PINNER"
  profile_image: string
  website_url: string
  username: string
}

/**
 * Add Pinterest login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/pinterest
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Pinterest from "@auth/core/providers/pinterest"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Pinterest({ clientId: PINTEREST_CLIENT_ID, clientSecret: PINTEREST_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Pinterest OAuth documentation](https://developers.pinterest.com/docs/getting-started/authentication/)
 *  - [Pinterest app console](https://developers.pinterest.com/apps/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Pinterest provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 *
 * :::tip
 *
 * To use in production, make sure the app has standard API access and not trial access
 *
 * :::
 *
 * :::tip
 *
 * The Pinterest provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/pinterest.ts).
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
export default function PinterestProvider<P extends PinterestProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "pinterest",
    name: "Pinterest",
    type: "oauth",
    authorization: {
      url: "https://www.pinterest.com/oauth",
      params: { scope: "user_accounts:read" },
    },
    token: "https://api.pinterest.com/v5/oauth/token",
    userinfo: "https://api.pinterest.com/v5/user_account",
    profile({ username, profile_image }) {
      return {
        id: username,
        name: username,
        image: profile_image,
        email: null,
      }
    },
    options,
  }
}
