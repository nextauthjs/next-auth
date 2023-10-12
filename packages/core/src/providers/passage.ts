/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Passage by 1Password</b> integration.</span>
 * <a href="https://passage.1password.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/passage.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/passage
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Supported Scopes](https://docs.passage.id/hosted-login/oidc-client-configuration#supported-scopes) */
export interface PassageProfile {
  iss: string
  /** Unique identifer in Passage for the user */
  sub: string
  aud: string[]
  exp: number
  iat: number
  auth_time: number
  azp: string
  client_id: string
  at_hash: string
  c_hash: string
  /** The user's email address */
  email: string
  /** Whether the user has verified their email address */
  email_verified: boolean
  /** The user's phone number */
  phone: string
  /** Whether the user has verified their phone number */
  phone_number_verified: boolean
}

/**
 * Add Passage login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/passage
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Passage from "@auth/core/providers/passage"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Passage({ clientId: PASSAGE_ID, clientSecret: PASSAGE_SECRET, issuer: PASSAGE_ISSUER })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Passage OIDC documentation](https://docs.passage.id/hosted-login/oidc-client-configuration)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Passage provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Passage provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/passage.ts).
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
export default function Passage(
  config: OAuthUserConfig<PassageProfile>
): OAuthConfig<PassageProfile> {
  return {
    id: "passage",
    name: "Passage",
    type: "oidc",
    client: { token_endpoint_auth_method: "client_secret_basic" },
    style: {
      logo: "/passage.svg",
      bg: "#fff",
      text: "#000",
    },
    options: config,
  }
}
