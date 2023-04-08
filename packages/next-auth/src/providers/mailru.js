/** @type {import(".").OAuthProvider} */
export default function MailRu(options) {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    authorization: "https://oauth.mail.ru/login?scope=userinfo",
    token: "https://oauth.mail.ru/token",
    userinfo: {
        async request({ tokens }) {
          const res = await fetch(
            `https://oauth.mail.ru/userinfo?access_token=${tokens.access_token}`
          );
          return await res.json();
        },
      },
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
