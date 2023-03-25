import { OAuthConfig, OAuthUserConfig } from "."

export interface YandexProfile {
  id: string
  login?: string
  client_id: string
  display_name: string
  real_name: string
  first_name: string
  last_name?: string
  sex?: string
  default_email?: string
  emails: string[]
  psuid: string
  /** bithday will be in YYYY-MM-DD formated string if exists */
  birthday?: string
  is_avatar_empty?: boolean
  default_avatar_id?: string
  default_phone?: { id: number; number: string }
}

export default function Yandex(
  options: OAuthUserConfig<YandexProfile>
): OAuthConfig<YandexProfile> {
  return {
    id: "yandex",
    name: "Yandex",
    type: "oauth",
    // user will be prompted for rights which were set while creating OAuth app
    authorization: "https://oauth.yandex.ru/authorize?scope=",
    token: "https://oauth.yandex.ru/token",
    userinfo: "https://login.yandex.ru/info?format=json",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name ?? profile.real_name ?? profile.first_name,
        email:
          profile.default_email ?? profile.emails?.[0] ?? null,
        image:
          !profile.is_avatar_empty && profile.default_avatar_id
            ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
            : null,
      }
    },
    style: {
      logo: "/yandex.svg",
      logoDark: "/yandex.svg",
      bg: "#ffcc00",
      text: "#000",
      bgDark: "#ffcc00",
      textDark: "#000",
    },
    options,
  }
}
