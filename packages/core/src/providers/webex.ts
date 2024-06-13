/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Webex</b> integration.</span>
 * <a href="https://webex.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/webex.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/webex
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * The returned user profile from Webex when using the profile callback.
 *
 * Please refer to {@link https://developer.webex.com/docs/api/v1/people/get-my-own-details People - Get My Own Details}
 * on Webex Developer portal for additional fields. Returned fields may vary depending on the user's role, the OAuth
 * integration's scope, and the organization the OAuth integration belongs to.
 */
export interface WebexProfile extends Record<string, any> {
  id: string
  emails: string[]
  displayName?: string
  avatar?: string
}

/**
 * Add Webex login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/webex
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Webex from "@auth/core/providers/webex"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Webex({ clientId: WEBEX_CLIENT_ID, clientSecret: WEBEX_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Webex OAuth 2.0 Integration Guide](https://developer.webex.com/docs/integrations)
 * - [Login with Webex](https://developer.webex.com/docs/login-with-webex)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Webex provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Webex provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/webex.ts).
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
export default function Webex<P extends WebexProfile>(
  config: OAuthUserConfig<P> & { apiBaseUrl?: string }
): OAuthConfig<P> {
  const apiBaseUrl = config?.apiBaseUrl ?? "https://webexapis.com/v1"

  return {
    id: "webex",
    name: "Webex",
    type: "oauth",
    authorization: {
      url: `${apiBaseUrl}/authorize`,
      params: { scope: "spark:kms spark:people_read" },
    },
    token: `${apiBaseUrl}/access_token`,
    userinfo: `${apiBaseUrl}/people/me`,
    profile(profile) {
      return {
        id: profile.id,
        email: profile.emails[0],
        name: profile.displayName,
        image: profile.avatar,
      }
    },
    options: config,
  }
}
