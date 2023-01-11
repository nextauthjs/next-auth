/** @type {import(".").OAuthProvider} */
export default function MailRu(options) {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    authorization: "https://oauth.mail.ru/login?scope=userinfo",
    token: "https://oauth.mail.ru/token",
    userinfo: "https://oauth.mail.ru/userinfo",
    options,
  }
}
