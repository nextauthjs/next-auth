/**
 * <div style={{backgroundColor: "#fff", display: "flex", justifyContent: "space-between", color: "#FF6243", padding: 16}}>
 * <span>Built-in <b>Whop</b> integration.</span>
 * <a href="https://whop.com/">
 *   <img style={{display: "block"}} src="https://whop.com/logo.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/whop
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"
/**
 * - {@link https://dev.whop.com/reference/retrieve_users_profile | Retreive user profile}
 */
export interface WhopProfile extends Record<string, any> {
  id: string
  username: string
  email: string
  profile_pic_url: string
}

/**
 * Add Whop OAuth login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/whop/
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Whop from "@auth/core/providers/whop"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Whop({ clientId: WHOP_CLIENT_ID, clientSecret: WHOP_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Whop OAuth documentation](https://dev.whop.com/oauth)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Whop provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Whop provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/whop.ts).
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
export default function Whop<P extends WhopProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: "whop",
    name: "Whop",
    type: "oauth",
    authorization: {
      url: "https://whop.com/oauth",
    },
    token: "https://api.whop.com/v5/oauth/token",
    userinfo: "https://api.whop.com/v5/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.profile_pic_url,
      }
    },
    style: {
      logo: "/google.svg",
      bg: "#fff",
      text: "#FF6243",
    },
    options,
  }
}
