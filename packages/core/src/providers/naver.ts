import type { OAuthConfig, OAuthUserConfig } from "."

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
    checks: ["state"],
    options,
  }
}
