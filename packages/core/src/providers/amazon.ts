/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Amazon</b> integration.</span>
 * <a href="https://google.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/google.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/amazon
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface AmazonProfile extends Record<string, any> {
  aud: string
  azp: string
  email: string
  exp: number
  hd: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  sub: string
  user_id: string
}

/**
 * Add Amazon login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/amazon
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Amazon from "@auth/core/providers/amazon"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Amazon({ clientId: AMAZON_CLIENT_ID, clientSecret: AMAZON_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Amazon OAuth documentation](https://developer.amazon.com/ja/docs/login-with-amazon/documentation-overview.html)
 *  - [Amazon OAuth Configuration](https://developer.amazon.com/loginwithamazon/console/site/lwa/overview.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Amazon provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 *
 * The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;
 *
 * - For production: `https://{YOUR_DOMAIN}/api/auth/callback/amazon`
 * - For development: `http://localhost:3000/api/auth/callback/amazon`
 *
 * :::warning
 * Amazon only provides Refresh Token to an application the first time a user signs in.
 *
 * To force Google to re-issue a Refresh Token, the user needs to remove the application from their account and sign in again:
 * https://myaccount.google.com/permissions
 *
 * Alternatively, you can also pass options in the `params` object of `authorization` which will force the Refresh Token to always be provided on sign in, however this will ask all users to confirm if they wish to grant your application access every time they sign in.
 *
 * If you need access to the RefreshToken or AccessToken for a Amazon account and you are not using a database to persist user accounts, this may be something you need to do.
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * const options = {
 *   providers: [
 *     AmazonProvider({
 *       clientId: process.env.AMAZON_ID,
 *       clientSecret: process.env.AMAZON_SECRET,
 *       authorization: {
 *         params: {
 *           prompt: "consent",
 *           access_type: "offline",
 *           response_type: "code"
 *         }
 *       }
 *     })
 *   ],
 * }
 * ```
 *
 * :::
 *
 * :::tip
 * Google also returns a `email_verified` boolean property in the OAuth profile.
 *
 * You can use this property to restrict access to people with verified accounts at a particular domain.
 *
 * ```js
 * const options = {
 *   ...
 *   callbacks: {
 *     async signIn({ account, profile }) {
 *       if (account.provider === "google") {
 *         return profile.email_verified && profile.email.endsWith("@example.com")
 *       }
 *       return true // Do different verification for other providers that don't have `email_verified`
 *     },
 *   }
 *   ...
 * }
 * ```
 *
 * :::
 * :::tip
 *
 * The Google provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/google.ts).
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
export default function Amazon<P extends AmazonProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "amazon",
    name: "Amazon",
    type: "oidc",
    issuer: "https://www.amazon.com",
    style: {
      logo: "/amazon.svg",
      logoDark: "/amazon.svg",
      bgDark: "#fff",
      bg: "#fff",
      text: "#000",
      textDark: "#000",
    },
    options,
  }
}
