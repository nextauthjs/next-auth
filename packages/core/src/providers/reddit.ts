/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Reddit</b> integration.</span>
 * <a href="https://www.reddit.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/reddit.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/reddit
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Reddit login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/reddit
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Reddit from "@auth/core/providers/reddit"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Reddit({ clientId: REDDIT_CLIENT_ID, clientSecret: REDDIT_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Reddit API documentation](https://www.reddit.com/dev/api/)
 * - [Reddit app console](https://www.reddit.com/prefs/apps/ )
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Reddit provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::danger
 *
 * Reddit requires authorization every time you go through their page.
 * Only allows one callback URL per Client ID / Client Secret.
 *
 * :::
 *
 * :::tip
 *
 * This Provider template only has a one hour access token to it and only has the "identity" scope. If you want to get a refresh token as well you must follow this:
 *```ts
 * providers: [
 *  Reddit({
 *    clientId: process.env.REDDIT_CLIENT_ID,
 *    clientSecret: process.env.REDDIT_CLIENT_SECRET,
 *    authorization: {
 *      params: {
 *        duration: 'permanent',
 *      },
 *    },
 *  }),
 * ]
 * ```
 * :::
 *
 * :::tip
 *
 * The Reddit provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/reddit.ts).
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
export default function Reddit(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "reddit",
    name: "Reddit",
    type: "oauth",
    authorization: "https://www.reddit.com/api/v1/authorize?scope=identity",
    token: "https://www.reddit.com/api/v1/access_token",
    userinfo: "https://oauth.reddit.com/api/v1/me",
    checks: ["state"],
    style: {
      brandColor: "#FF4500",
    },
    options: config,
  }
}
