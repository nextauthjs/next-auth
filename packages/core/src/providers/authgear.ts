/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Authgear</b> integration.</span>
 * <a href="https://authgear.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/authgear.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/authgear
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * The standard fields for a user profile returned by Authgear's UserInfo endpoint.
 *
 * See  {@link https://docs.authgear.com/reference/apis/oauth-2.0-and-openid-connect-oidc/userinfo UserInfo Endpoint} to learn more about each field.
 */
export interface AuthgearProfile extends Record<string, any> {
  sub: string
  email: string
  email_verified: boolean
  phone_number: string
  phone_number_verified: boolean
  preferred_username: string
  family_name: string
  given_name: string
  middle_name: string
  name: string
  nickname: string
  picture: string
  profile: string
  website: string
  gender: string
  birthdate: string
  zoneinfo: string
  locale: string
  address: string
  updated_at: string
}

/**
 * Add Authgear login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/authgear
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Authgear from "@auth/core/providers/authgear"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Authgear({ clientId: process.env.AUTH_AUTHGEAR_CLIENT_ID, clientSecret: process.env.AUTH_AUTHGEAR_CLIENT_SECRET, issuer: process.env.AUTH_AUTHGEAR_ISSUER,})],
 * })
 * ```
 *
 * `AUTH_AUTHGEAR_ISSUER` is your project endpoint. You can find it in your Authgear Portal.
 *
 * ### Resources
 *
 * - [Authgear Regular Web Apps Integration Guide](https://docs.authgear.com/get-started/regular-web-app)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Webex provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * Authgear next-auth provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/authgear.ts).
 * To modify the default configuration for your specific use case, see [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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

export default function Authgear<P extends AuthgearProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "authgear",
    name: "Authgear",
    type: "oidc",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      params: {
        scope:
          "openid offline_access https://authgear.com/scopes/full-userinfo",
      },
    },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        email: profile?.email,
        image: profile?.picture,
        name: profile?.given_name,
      }
    },
    options,
  }
}
