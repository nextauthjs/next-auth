/**
 * <div style={{backgroundColor: "#fd4b2d", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Authentik</b> integration.</span>
 * <a href="https://goauthentik.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/authentik.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/authentik
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface AuthentikProfile extends Record<string, any> {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  auth_time: number
  acr: string
  c_hash: string
  nonce: string
  at_hash: string
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name: string
  preferred_username: string
  nickname: string
  groups: string[]
}

/**
 * Add Authentik login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/authentik
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Authentik from "@auth/core/providers/authentik"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Authentik({ clientId: AUTHENTIK_CLIENT_ID, clientSecret: AUTHENTIK_CLIENT_SECRET, issuer: AUTHENTIK_ISSUER })],
 * })
 * ```
 *
 * :::note
 * issuer should include the slug without a trailing slash – e.g., https://my-authentik-domain.com/application/o/My_Slug
 * :::
 *
 * ### Resources
 *
 *  - [Authentik OAuth documentation](https://goauthentik.io/docs/providers/oauth2)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Authentik provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Authentik provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/authentik.ts).
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
export default function Authentik<P extends AuthentikProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "authentik",
    name: "Authentik",
    type: "oidc",
    options,
  }
}
