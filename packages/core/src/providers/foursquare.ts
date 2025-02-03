/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>FourSquare</b> integration.</span>
 * <a href="https://foursquare.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/foursquare.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/foursquare
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add FourSquare login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/foursquare
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import FourSquare from "@auth/core/providers/foursquare"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     FourSquare({
 *       clientId: FOURSQUARE_CLIENT_ID,
 *       clientSecret: FOURSQUARE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [FourSquare OAuth documentation](https://docs.foursquare.com/developer/reference/authentication)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the FourSquare provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::warning
 * Foursquare requires an additional apiVersion parameter in YYYYMMDD format, which essentially states "I'm prepared for API changes up to this date".
 * :::
 *
 * :::tip
 *
 * The FourSquare provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/foursquare.ts).
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
export default function Foursquare(
  options: OAuthUserConfig<Record<string, any>> & { apiVersion?: string }
): OAuthConfig<Record<string, any>> {
  const { apiVersion = "20230131" } = options
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    authorization: "https://foursquare.com/oauth2/authenticate",
    token: "https://foursquare.com/oauth2/access_token",
    userinfo: {
      url: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,
      async request({ tokens, provider }) {
        if (!provider.userinfo) return

        const url = new URL(provider.userinfo.url)
        url.searchParams.append("oauth_token", tokens.access_token!)
        return fetch(url).then((res) => res.json())
      },
    },
    profile({ response: { user: profile } }) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: profile.photo
          ? `${profile.photo.prefix}original${profile.photo.suffix}`
          : null,
      }
    },
    style: {
      bg: "#000",
      text: "#fff",
    },
    options,
  }
}
