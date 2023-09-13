/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Kakao</b> integration.</span>
 * <a href="https://www.kakaocorp.com/page/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/kakao.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/kakao
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export type DateTime = string
export type Gender = "female" | "male"
export type Birthday = "SOLAR" | "LUNAR"
export type AgeRange =
  | "1-9"
  | "10-14"
  | "15-19"
  | "20-29"
  | "30-39"
  | "40-49"
  | "50-59"
  | "60-69"
  | "70-79"
  | "80-89"
  | "90-"

/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 * type from : https://gist.github.com/ziponia/cdce1ebd88f979b2a6f3f53416b56a77
 */
export interface KakaoProfile extends Record<string, any> {
  id: number
  has_signed_up?: boolean
  connected_at?: DateTime
  synched_at?: DateTime
  properties?: {
    id?: string
    status?: string
    registered_at?: DateTime
    msg_blocked?: boolean
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile_needs_agreement?: boolean
    profile_nickname_needs_agreement?: boolean
    profile_image_needs_agreement?: boolean
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
    }
    name_needs_agreement?: boolean
    name?: string
    email_needs_agreement?: boolean
    is_email_valid?: boolean
    is_email_verified?: boolean
    email?: string
    age_range_needs_agreement?: boolean
    age_range?: AgeRange
    birthyear_needs_agreement?: boolean
    birthyear?: string
    birthday_needs_agreement?: boolean
    birthday?: string
    birthday_type?: Birthday
    gender_needs_agreement?: boolean
    gender?: Gender
    phone_number_needs_agreement?: boolean
    phone_number?: string
    ci_needs_agreement?: boolean
    ci?: string
    ci_authenticated_at?: DateTime
  }
}

/**
 * Add Kakao login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/kakao
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Kakao from "@auth/core/providers/kakao"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Kakao({ clientId: KAKAO_CLIENT_ID, clientSecret: KAKAO_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Kakao OAuth documentation](https://developers.kakao.com/product/kakaoLogin)
 *  - [Kakao OAuth configuration](https://developers.kakao.com/docs/latest/en/kakaologin/common)
 *
 * ## Configuration
 * Create a provider and a Kakao application at https://developers.kakao.com/console/app. In the settings of the app under Kakao Login, activate web app, change consent items and configure callback URL.
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Kakao provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Kakao provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/kakao.ts).
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
export default function Kakao<P extends KakaoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: "https://kauth.kakao.com/oauth/authorize?scope",
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.kakao_account?.profile?.nickname,
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile?.profile_image_url,
      }
    },
    options,
  }
}
