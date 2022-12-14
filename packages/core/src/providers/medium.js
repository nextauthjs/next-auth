/** @type {import(".").OAuthProvider} */
export default function Medium(options) {
  return {
    id: "medium",
    name: "Medium",
    type: "oauth",
    authorization: "https://medium.com/m/oauth/authorize?scope=basicProfile",
    token: "https://api.medium.com/v1/tokens",
    userinfo: "https://api.medium.com/v1/me",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: null,
        image: profile.data.imageUrl,
      }
    },
    options,
  }
}
