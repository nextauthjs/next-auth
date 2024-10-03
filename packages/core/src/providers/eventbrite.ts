/**
 * <div class="provider" style={{backgroundColor: "#f05537", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Eventbrite</b> integration.</span>
 * <a href="https://www.eventbrite.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/eventbrite.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/eventbrite
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * @see https://www.eventbrite.com/platform/api#/reference/user/retrieve-your-user/retrieve-your-user
 */
export interface EventbriteProfile extends Record<string, any> {
  id: string
  name: string
  first_name: string
  last_name: string
  emails: { email: string; verified: boolean; primary: boolean }[]
  image_id: string
}

/**
 * Add Eventbrite login to your page and make requests to [Eventbrite APIs](https://www.eventbrite.com/platform/api).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/eventbrite
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Eventbrite from "@auth/core/providers/eventbrite"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Eventbrite({ clientId: EVENTBRITE_CLIENT_ID, clientSecret: EVENTBRITE_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Eventbrite OAuth documentation](https://www.eventbrite.com/platform/api#/introduction/authentication)
 * - [Eventbrite App Management](https://www.eventbrite.com/account-settings/apps)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/eventbrite.ts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Eventbrite provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Eventbrite provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/eventbrite.ts).
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
export default function Eventbrite<P extends EventbriteProfile>(
  config: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "eventbrite",
    name: "Eventbrite",
    type: "oauth",
    authorization: {
      url: "https://www.eventbrite.com/oauth/authorize",
      params: { scope: "user.profile" },
    },
    token: "https://www.eventbrite.com/oauth/token",
    userinfo: "https://www.eventbriteapi.com/v3/users/me/",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.emails.find((e) => e.primary)?.email,
        image: profile.image_id
          ? `https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F${profile.image_id}%2F1%2Foriginal.jpg`
          : null,
      }
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    style: { bg: "#f05537", text: "#fff" },
    options: config,
  }
}
