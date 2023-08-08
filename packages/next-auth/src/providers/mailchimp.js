/** @type {import(".").OAuthProvider} */
export default function Mailchimp(options) {
  return {
    id: "mailchimp",
    name: "Mailchimp",
    type: "oauth",
    authorization: "https://login.mailchimp.com/oauth2/authorize",
    token: "https://login.mailchimp.com/oauth2/token",
    userinfo: "https://login.mailchimp.com/oauth2/metadata",
    profile(profile) {
      return {
        id: profile.login.login_id,
        name: profile.accountname,
        email: profile.login.email,
        image: null,
      }
    },
    style: {
      logo: "/mailchimp.svg",
      logoDark: "/mailchimp-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options,
  }
}
