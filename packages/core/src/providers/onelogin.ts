/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>OneLogin</b> integration.</span>
 * <a href="https://onelogin.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/onelogin.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/onelogin
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add OneLogin login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/onelogin
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import OneLogin from "@auth/core/providers/onelogin"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     OneLogin({
 *       clientId: ONELOGIN_CLIENT_ID,
 *       clientSecret: ONELOGIN_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [OneLogin OAuth documentation](https://example.com)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the OneLogin provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The OneLogin provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/onelogin.ts).
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
export default function OneLogin(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oidc",
    wellKnown: `${config.issuer}/oidc/2/.well-known/openid-configuration`,
    options: config,
  }
}
