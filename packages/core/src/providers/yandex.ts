import { OAuthConfig, OAuthUserConfig } from "."

export interface YandexProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  login: string
  client_id: string
  display_name: string
  real_name: string
  first_name: string
  last_name: string | null
  sex: string | null
  default_email: string
  emails: string[]
  psuid: string
  // bithday will be in YYYY-MM-DD formated string if exists
  birthday: string | null | undefined
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
    authorization:
      "https://oauth.yandex.ru/authorize?scope=login:email+login:info",
    token: "https://oauth.yandex.ru/token",
    userinfo: "https://login.yandex.ru/info?format=json",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.real_name || profile.display_name || null,
        email: profile.default_email || (profile.emails.length > 0 ? profile.emails[0] : null),
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
