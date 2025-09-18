/**
 * <div class="provider" style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>World Cube Association</b> integration.</span>
 * <a href="https://www.worldcubeassociation.org/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/wca.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/wca
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Get the authenticated user](https://www.worldcubeassociation.org/help/api) */
export interface WCAProfile {
  me: {
    id: number
    created_at: string
    updated_at: string
    name: string
    wca_id: string | null
    gender: string
    country_iso2: string
    url: string
    country: {
      id: string
      name: string
      continent_id: string
      iso2: string
    }
    delegate_status: string | null
    class: string
    teams: any[]
    avatar: {
      id: number | null
      status: string
      thumbnail_crop_x: number
      thumbnail_crop_y: number
      thumbnail_crop_w: number
      thumbnail_crop_h: number
      url: string
      thumb_url: string
      is_default: boolean
      can_edit_thumbnail: boolean
    }
    email: string
  }
}

/**
 * Add WCA login to your page and make requests to [WCA APIs](https://www.worldcubeassociation.org/api).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/wca
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Wca from "@auth/core/providers/wca"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Wca({ clientId: WCA_CLIENT_ID, clientSecret: WCA_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [WCA API docs](https://www.worldcubeassociation.org/help/api)
 * - [WCA OAuth overview](https://www.worldcubeassociation.org/api#oauth)
 * - [Create/Manage WCA OAuth Apps](https://www.worldcubeassociation.org/oauth/applications)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/wca.ts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the WCA provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The WCA provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/wca.ts).
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
export default function Wca(
  config: OAuthUserConfig<WCAProfile>
): OAuthConfig<WCAProfile> {
  const apiBaseUrl = "https://www.worldcubeassociation.org"
  return {
    id: "wca",
    name: "World Cube Association",
    type: "oauth",
    authorization: {
      url: `${apiBaseUrl}/oauth/authorize`,
      params: { scope: "public" },
    },
    token: `${apiBaseUrl}/oauth/token`,
    userinfo: {
      url: `${apiBaseUrl}/api/v0/me`,
      async request({ tokens }) {
        const profile = await fetch(`${apiBaseUrl}/api/v0/me`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        })

        return await profile.json()
      },
    },
    profile(profile) {
      const { id, name, avatar, email } = profile.me
      return { id: id.toString(), name, email, image: avatar.url }
    },
    style: { bg: "#24292f", text: "#fff" },
    options: config,
  }
}
