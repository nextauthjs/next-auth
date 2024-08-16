/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>HubSpot</b> integration.</span>
 * <a href="https://hubspot.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/hubspot.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/hubspot
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

interface HubSpotProfile extends Record<string, any> {
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information
  user: string
  user_id: string
  hub_domain: string
  hub_id: string
}

/**
 * Add HubSpot login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/hubspot
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import HubSpot from "@auth/core/providers/hubspot"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     HubSpot({
 *       clientId: HUBSPOT_CLIENT_ID,
 *       clientSecret: HUBSPOT_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [HubSpot OAuth documentation](https://developers.hubspot.com/docs/api/oauth-quickstart-guide)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the HubSpot provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * You need to have an APP in your Developer Account as described at https://developers.hubspot.com/docs/api/developer-tools-overview
 * :::note
 * HubSpot returns a limited amount of information on the token holder (see [docs](https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information)). One other issue is that the name and profile photo cannot be fetched through API as discussed [here](https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521).
 * :::
 * :::tip
 *
 * The HubSpot provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/hubspot.ts).
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
export default function HubSpot<P extends HubSpotProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "hubspot",
    name: "HubSpot",
    type: "oauth",
    authorization: {
      url: "https://app.hubspot.com/oauth/authorize",
      params: { scope: "oauth", client_id: options.clientId },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: "https://api.hubapi.com/oauth/v1/token",
    userinfo: {
      url: "https://api.hubapi.com/oauth/v1/access-tokens",
      async request({ tokens, provider }) {
        const url = `${provider.userinfo?.url}/${tokens.access_token}`

        return await fetch(url, {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }).then(async (res) => await res.json())
      },
    },
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile.user,
        email: profile.user,

        // TODO: get image from profile once it's available
        // Details available https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521
        image: null,
      }
    },
    style: { bg: "#ff7a59", text: "#fff" },
    options,
  }
}
