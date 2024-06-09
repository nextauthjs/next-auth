/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Netlify</b> integration.</span>
 * <a href="https://netlify.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/netlify.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/netlify
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Netlify login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/netlify
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Netlify from "@auth/core/providers/netlify"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Netlify({
 *       clientId: NETLIFY_CLIENT_ID,
 *       clientSecret: NETLIFY_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Netlify OAuth blog](https://www.netlify.com/blog/2016/10/10/integrating-with-netlify-oauth2/)
 *  - [Netlify OAuth example](https://github.com/netlify/netlify-oauth-example/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Netlify provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Netlify provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/netlify.ts).
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
export default function Netlify(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "netlify",
    name: "Netlify",
    type: "oauth",
    authorization: "https://app.netlify.com/authorize?scope",
    token: "https://api.netlify.com/oauth/token",
    userinfo: "https://api.netlify.com/api/v1/user",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    style: {
      brandColor: "#32e6e2",
    },
    options: config,
  }
}
