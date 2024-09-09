/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Medium</b> integration.</span>
 * <a href="https://medium.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/medium.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/medium
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Medium login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/medium
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Medium from "@auth/core/providers/medium"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Medium({ clientId: MEDIUM_CLIENT_ID, clientSecret: MEDIUM_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Medium OAuth documentation](https://example.com)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Medium provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::warning
 *
 * Email address is not returned by the Medium API.
 *
 * :::
 *
 * :::tip
 *
 * The Medium provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/medium.ts).
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
export default function Medium(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "medium",
    name: "Medium",
    type: "oauth",
    authorization: "https://medium.com/m/oauth/authorize?scope=basicProfile",
    token: "https://api.medium.com/v1/tokens",
    userinfo: "https://api.medium.com/v1/me",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: null,
        image: profile.data.imageUrl,
      }
    },
    options: config,
  }
}
