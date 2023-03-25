import { OAuthConfig, OAuthUserConfig } from "."

export interface YandexProfile {
  id: string
  login: string | undefined
  client_id: string
  display_name: string
  real_name: string
  first_name: string
  last_name: string | undefined
  sex: string | undefined
  default_email: string | undefined
  emails: string[]
  psuid: string
  // bithday will be in YYYY-MM-DD formated string if exists
  birthday: string | undefined
  is_avatar_empty: boolean | undefined
  default_avatar_id: string | undefined
  default_phone: { id: number; number: string } | undefined
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
        name: profile.display_name || profile.real_name || profile.first_name,
        email:
          profile.default_email ||
          (profile.emails && profile.emails.length > 0
            ? profile.emails[0]
            : null),
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
