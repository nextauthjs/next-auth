export default function MailRu(options) {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    version: "2.0",
    scope: "userinfo",
    params: {
      grant_type: "authorization_code",
    },
    accessTokenUrl: "https://oauth.mail.ru/token",
    requestTokenUrl: "https://oauth.mail.ru/token",
    authorizationUrl: "https://oauth.mail.ru/login?response_type=code",
    profileUrl: "https://oauth.mail.ru/userinfo",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      }
    },
    ...options,
  }
}
