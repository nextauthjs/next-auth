/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Concept2</b> integration.</span>
 * <a href="https://concept2.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/concept2.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/concept2
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface Concept2Profile extends Record<string, any> {
  id: number
  username: string
  first_name: string
  last_name: string
  gender: string
  dob: string
  email: string
  country: string
  profile_image: string
  age_restricted: boolean
  email_permission: boolean | null
  max_heart_rate: number | null
  weight: number | null
  logbook_privacy: string | null
}

/**
 * Add Concept2 login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/concept2
 * ```
 *
 * #### Configuration
 *```js
 * import { Auth } from "@auth/core"
 * import Concept2 from "@auth/core/providers/concept2"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Concept2({
 *       clientId: CONCEPT2_CLIENT_ID,
 *       clientSecret: CONCEPT2_CLIENT_SECRET
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Concept2 OAuth documentation](https://log.concept2.com/developers/documentation/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Concept2 provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Concept2 provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/concept2.ts)).
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
export default function Concept2(
  options: OAuthUserConfig<Concept2Profile>
): OAuthConfig<Concept2Profile> {
  return {
    id: "concept2",
    name: "Concept2",
    type: "oauth",
    authorization: {
      url: "https://log.concept2.com/oauth/authorize",
      params: {
        scope: "user:read,results:write",
      },
    },
    token: "https://log.concept2.com/oauth/access_token",
    userinfo: "https://log.concept2.com/api/users/me",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.username,
        email: profile.data.email,
        image: profile.data.profile_image,
      }
    },
    options,
  }
}
