/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>FreshBooks</b> integration.</span>
 * <a href="https://freshbooks.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/freshbooks.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/freshbooks
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add FreshBooks login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/freshbooks
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import FreshBooks from "@auth/core/providers/freshbooks"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [FreshBooks({ clientId: FRESHBOOKS_CLIENT_ID, clientSecret: FRESHBOOKS_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [FreshBooks OAuth documentation](https://www.freshbooks.com/api/authenticating-with-oauth-2-0-on-the-new-freshbooks-api
)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the FreshBooks provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The FreshBooks provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/freshbooks.ts).
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
export default function Freshbooks(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "freshbooks",
    name: "Freshbooks",
    type: "oauth",
    authorization: "https://auth.freshbooks.com/service/auth/oauth/authorize",
    token: "https://api.freshbooks.com/auth/oauth/token",
    userinfo: "https://api.freshbooks.com/auth/api/v1/users/me",
    async profile(profile) {
      return {
        id: profile.response.id,
        name: `${profile.response.first_name} ${profile.response.last_name}`,
        email: profile.response.email,
        image: null,
      }
    },
    style: {
      logo: "/freshbooks.svg",
      bg: "#0075dd",
      text: "#fff",
    },
    options,
  }
}
