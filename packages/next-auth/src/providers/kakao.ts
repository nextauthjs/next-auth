import type { OAuthConfig, OAuthUserConfig } from "."

export type DateTime = string
export type Gender = "female" | "male"
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
export interface KakaoProfile {
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
    birthday_type?: string
    gender_needs_agreement?: boolean
    gender?: Gender
    phone_number_needs_agreement?: boolean
    phone_number?: string
    ci_needs_agreement?: boolean
    ci?: string
    ci_authenticated_at?: DateTime
  }
}

export default function Kakao<P extends Record<string, any> = KakaoProfile>(
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
        id: profile.id,
        name: profile.kakao_account?.profile.nickname,
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile.profile_image_url,
      }
    },
    options,
  }
}
