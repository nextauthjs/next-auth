export default function Yandex(options) {
  return {
    id: "yandex",
    name: "Yandex",
    type: "oauth",
    version: "2.0",
    scope: "login:email login:info login:avatar",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://oauth.yandex.ru/token",
    requestTokenUrl: "https://oauth.yandex.ru/token",
    authorizationUrl: "https://oauth.yandex.ru/authorize?response_type=code",
    profileUrl: "https://login.yandex.ru/info?format=json",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.real_name,
        email: profile.default_email,
        image: profile.is_avatar_empty ? null : `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`,
      }
    },
    ...options,
  }
}
