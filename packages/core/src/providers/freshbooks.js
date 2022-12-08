/** @type {import(".").OAuthProvider} */
export default function Freshbooks(options) {
  return {
    id: "freshbooks",
    name: "Freshbooks",
    type: "oauth",
    authorization: "https://auth.freshbooks.com/service/auth/oauth/authorize",
    token: "https://api.freshbooks.com/auth/oauth/token",
    userinfo: "https://api.freshbooks.com/auth/api/v1/users/me",
    async profile(profile) {
      return {
        id: profile.response.id,
        name: `${profile.response.first_name} ${profile.response.last_name}`,
        email: profile.response.email,
        image: null,
      }
    },
    style: {
      logo: "/freshbooks.svg",
      logoDark: "/freshbooks-dark.svg",
      bg: "#fff",
      text: "#0075dd",
      bgDark: "#0075dd",
      textDark: "#fff",
    },
    ...options,
  }
}
