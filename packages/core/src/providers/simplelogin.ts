/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>SimpleLogin</b> integration.</span>
 * <a href="https://simplelogin.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/simplelogin.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/simplelogin
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SimpleLoginProfile {
  id: number
  sub: string
  email: string
  email_verified: boolean
  name: string
  avatar_url: string | undefined
  client: string
}

/**
 * Add SimpleLogin login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/simplelogin
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import SimpleLogin from "@auth/core/providers/simplelogin"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     SimpleLogin({
 *       clientId: SIMPLELOGIN_CLIENT_ID,
 *       clientSecret: SIMPLELOGIN_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Sign in with SimpleLogin](https://simplelogin.io/developer/)
 *  - [SimpleLogin OAuth documentation](https://simplelogin.io/docs/siwsl/intro/)
 *  - [SimpleLogin OAuth Configuration](https://app.simplelogin.io/developer)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the SimpleLogin provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * The "Authorized redirect URIs" used must include your full domain and end in the callback path. By default, SimpleLogin whitelists all `http[s]://localhost:*` address to facilitate local development. For example;
 *
 * - For production: `https://{YOUR_DOMAIN}/api/auth/callback/simplelogin`
 * - For development: By default **localhost** is whitelisted.
 *
 * :::warning
 *
 * **Authorized Redirect URIs** must be **HTTPS** for security reason (except for `localhost`).
 *
 * :::
 *
 * :::tip
 *
 * The SimpleLogin provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/simplelogin.ts).
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
export default function SimpleLogin<P extends SimpleLoginProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "simplelogin",
    name: "SimpleLogin",
    type: "oidc",
    issuer: "https://app.simplelogin.io",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    style: { brandColor: "#e3156a" },
    options,
  }
}
