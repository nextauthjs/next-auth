/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Authgear</b> integration.</span>
 * <a href="https://authgear.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/authgear.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/authgear
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface AuthgearProfile extends Record<string, any> {
  sub: string
  name: string
  email: string
  picture: string
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
 *```ts
 * import { Auth } from "@auth/core"
 * import Authgear from "@auth/core/providers/authgear"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Authgear({
 *       clientId: YOUR_AUTHGEAR_CLIENT_ID,
 *       clientSecret: YOUR_AUTHGEAR_CLIENT_SECRET,
 *       issuer: YOUR_AUTHGEAR_ISSUER_OR_PROJECT_ENDPOINT,
 *       client: {
           token_endpoint_auth_method: "client_secret_post",
         }
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Authgear OAuth documentation](https://docs.authgear.com/get-started/regular-web-app)
 *
 * :::tip
 *
 * The Authgear provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/authgear.ts).
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
export default function Authgear<P extends AuthgearProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "authgear",
    name: "Authgear",
    type: "oidc",
    style: { bg: "#000", text: "#fff" },
    options,
  }
}
