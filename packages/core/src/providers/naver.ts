/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Naver</b> integration.</span>
 * <a href="https://naver.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/naver.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/naver
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** https://developers.naver.com/docs/login/profile/profile.md */
export interface NaverProfile extends Record<string, any> {
  resultcode: string
  message: string
  response: {
    id: string
    nickname?: string
    name?: string
    email?: string
    gender?: "F" | "M" | "U"
    age?: string
    birthday?: string
    profile_image?: string
    birthyear?: string
    mobile?: string
  }
}

/**
 * Add Naver login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/naver
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Naver from "@auth/core/providers/naver"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Naver({ clientId: NAVER_CLIENT_ID, clientSecret: NAVER_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Naver OAuth documentation](https://developers.naver.com/docs/login/overview/overview.md)
 *  - [Naver OAuth documentation 2](https://developers.naver.com/docs/login/api/api.md)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Naver provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Naver provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/naver.ts).
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
export default function Naver<P extends NaverProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: "https://nid.naver.com/oauth2.0/authorize",
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile) {
      return {
        id: profile.response.id,
        name: profile.response.nickname,
        email: profile.response.email,
        image: profile.response.profile_image,
      }
    },
    options,
  }
}
