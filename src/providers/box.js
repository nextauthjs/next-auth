/** @type {import(".").OAuthProvider} */
export default function Box(options) {
  return {
    id: "box",
    name: "Box",
    type: "oauth",
    authorization: "https://account.box.com/api/oauth2/authorize",
    token: "https://api.box.com/oauth2/token",
    userinfo: "https://api.box.com/2.0/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.login,
        image: profile.avatar_url,
      }
    },
    options,
  }
}
