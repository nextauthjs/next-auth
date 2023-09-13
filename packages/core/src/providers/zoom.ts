/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Zoom</b> integration.</span>
 * <a href="https://zoom.us/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/zoom.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/zoom
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * See: https://developers.zoom.us/docs/integrations/oauth/#using-an-access-token
 */
export interface ZoomProfile extends Record<string, any> {
  id: string
  first_name: string
  last_name: string
  email: string
  type: number
  role_name: string
  pmi: number
  use_pmi: boolean
  vanity_url: string
  personal_meeting_url: string
  timezone: string
  verified: number
  dept: string
  created_at: string
  last_login_time: string
  last_client_version: string
  pic_url: string
  host_key: string
  jid: string
  group_ids: string[]
  im_group_ids: string[]
  account_id: string
  language: string
  phone_country: string
  phone_number: string
  status: string
}

/**
 * Add Zoom login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/zoom
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Zoom from "@auth/core/providers/zoom"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Zoom({ clientId: ZOOM_CLIENT_ID, clientSecret: ZOOM_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Zoom OAuth 2.0 Integration Guide](https://developers.zoom.us/docs/integrations/oauth/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Zoom provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Zoom provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/zoom.ts).
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
export default function Zoom(
  config: OAuthUserConfig<ZoomProfile>
): OAuthConfig<ZoomProfile> {
  return {
    id: "zoom",
    name: "Zoom",
    type: "oauth",
    authorization: "https://zoom.us/oauth/authorize?scope",
    token: "https://zoom.us/oauth/token",
    userinfo: "https://api.zoom.us/v2/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.pic_url,
      }
    },
    options: config,
  }
}
