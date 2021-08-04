export default function MailRu(options) {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    authorization: "https://oauth.mail.ru/login?scope=userinfo",
    token: "https://oauth.mail.ru/token",
    userinfo: "https://oauth.mail.ru/userinfo",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      }
    },
    options,
  }
}
