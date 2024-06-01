/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Seznam.cz</b> integration.</span>
 * <a href="https://vyvojari.seznam.cz/oauth">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/seznam.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/seznam
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SeznamProfile extends Record<string, any> {
  accountDisplayName: string,
  advert_user_id: string,
  domain: string,
  email: string,
  email_verified: boolean,
  firstname: string,
  lastname: string,
  oauth_user_id: string,
  username: string,
}

/**
 * Add Seznam.cz login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/seznam
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Seznam from "@auth/core/providers/seznam"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Seznam({
 *        clientId: process.env.SEZNAM_CLIENT_ID,
 *        clientSecret: process.env.SEZNAM_CLIENT_SECRET,
 *        scope: "identity"
 *     })
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Seznam OAuth documentation](https://vyvojari.seznam.cz/oauth/doc?lang=en)
 *
 * ### Notes
 *
 *
 * :::tip
 * Seznam also returns a `email_verified` boolean property in the OAuth profile.
 *
 * You can use this property to restrict access to people with verified accounts at a particular domain.
 *
 * :::
 */
export default function Seznam<P extends SeznamProfile>(
  options: OAuthUserConfig<P> & { scope?: string }
): OAuthConfig<P> {
  return {
    id: "seznam",
    name: "Seznam",
    type: "oauth",
    authorization: {
      url: "https://login.szn.cz/api/v1/oauth/auth",
      params: {
        scope: options.scope || "identity",
        response_type: "code",
      },
    },
    token: 'https://login.szn.cz/api/v1/oauth/token',
    userinfo: 'https://login.szn.cz/api/v1/user',
    client: {
      token_endpoint_auth_method: 'client_secret_post'
    },
    checks: ['state'],

    style: {
      brandColor: '#CC0000',
    },
    options,
  }
}
