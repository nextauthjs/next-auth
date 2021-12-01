/** @type {import(".").OAuthProvider} */
export default function WordPress(options) {
  return {
    id: "wordpress",
    name: "WordPress.com",
    type: "oauth",
    authorization:
      "https://public-api.wordpress.com/oauth2/authorize?scope=auth",
    token: "https://public-api.wordpress.com/oauth2/token",
    userinfo: "https://public-api.wordpress.com/rest/v1/me",
    profile(profile) {
      return {
        id: profile.ID,
        name: profile.display_name,
        email: profile.email,
        image: profile.avatar_URL,
      }
    },
    options,
  }
}
