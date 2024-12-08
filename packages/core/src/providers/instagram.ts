/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Instagram</b> integration.</span>
 * <a href="https://www.instagram.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/instagram.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/instagram
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Instagram login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/instagram
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Instagram from "@auth/core/providers/instagram"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Instagram({
 *       clientId: INSTAGRAM_CLIENT_ID,
 *       clientSecret: INSTAGRAM_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Instagram OAuth documentation](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started)
 *  - [Instagram OAuth apps](https://developers.facebook.com/apps/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Instagram provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 *
 * :::warning
 * Email address is not returned by the Instagram API.
 * :::
 *
 * :::tip
 * Instagram display app required callback URL to be configured in your Facebook app and Facebook required you to use **https** even for localhost! In order to do that, you either need to [add an SSL to your localhost](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) or use a proxy such as [ngrok](https://ngrok.com/docs).
 * :::
 * :::tip
 *
 * The Instagram provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/instagram.ts).
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
export default function Instagram(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "instagram",
    name: "Instagram",
    type: "oauth",
    authorization:
      "https://api.instagram.com/oauth/authorize?scope=user_profile",
    token: "https://api.instagram.com/oauth/access_token",
    userinfo:
      "https://graph.instagram.com/me?fields=id,username,account_type,name",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    async profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null,
      }
    },
    style: {
      bg: "#fff",
      text: "#000",
    },
    options: config,
  }
}
