/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Eartho</b> integration.</span>
 * <a href="https://eartho.io">
 *   <img style={{display: "block"}} src="https://eartho.io/logo.png" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/eartho
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface EarthoProfile extends Record<string, any> {
  aud: string
  email: string
  email_verified: boolean
  exp: number
  family_name?: string
  given_name: string
  iat: number
  iss: string
  locale?: string
  name: string
  picture: string
  sub: string
}

/**
 * Add Eartho login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/eartho
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Eartho from "@auth/core/providers/eartho"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Eartho({ clientId: EARTHO_CLIENT_ID, clientSecret: EARTHO_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Eartho OAuth documentation](https://docs.eartho.io/)
 *  - [Eartho OAuth Configuration](https://console.eartho.io)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Eartho provider is
 * based on the [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;
 *
 * - For production: `https://{YOUR_DOMAIN}/api/auth/callback/eartho`
 * - For development: `http://localhost:3000/api/auth/callback/eartho`
 *
 * :::
 *
 * :::tip
 * Eartho also returns an `email_verified` boolean property in the OAuth profile.
 *
 * You can use this property to restrict access to people with verified accounts.
 *
 * ```ts
 * const options = {
 *   ...
 *   callbacks: {
 *     async signIn({ account, profile }) {
 *       if (account.provider === "eartho") {
 *         return profile.email_verified
 *       }
 *       return true
 *     },
 *   }
 *   ...
 * }
 * ```
 *
 * :::
 *
 * The Eartho provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/eartho.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 */
export default function Eartho<P extends EarthoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "eartho",
    name: "Eartho",
    type: "oidc",
    issuer: "https://account.eartho.io",
    idToken: false,
    checks: ["pkce"],
    style: {
      brandColor: "#000",
      logo: "https://eartho.io/logo.png",
    },
    profile: (profile: any) => {
      return {
        id: profile.sub,
        image: profile.picture,
        ...profile
      }
    },
    options,
  }
}
