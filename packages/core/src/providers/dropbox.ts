/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Dropbox</b> integration.</span>
 * <a href="https://dropbox.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/dropbox.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/dropbox
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Dropbox login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/dropbox
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Dropbox from "@auth/core/providers/dropbox"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Dropbox({ clientId: DROPBOX_CLIENT_ID, clientSecret: DROPBOX_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Dropbox OAuth documentation](https://developers.dropbox.com/oauth-guide)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Dropbox provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Dropbox provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/dropbox.ts).
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
export default function Dropbox(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "dropbox",
    name: "Dropbox",
    type: "oauth",
    authorization:
      "https://www.dropbox.com/oauth2/authorize?token_access_type=offline&scope=account_info.read",
    token: "https://api.dropboxapi.com/oauth2/token",
    userinfo: "https://api.dropboxapi.com/2/users/get_current_account",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name.display_name,
        email: profile.email,
        image: profile.profile_photo_url,
      }
    },
    options,
  }
}
