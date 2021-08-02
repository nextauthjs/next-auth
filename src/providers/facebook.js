/** @type {import("types/providers").OAuthProvider} */
export default function Facebook(options) {
  return {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    authorization: "https://www.facebook.com/v11.0/dialog/oauth?scope=email",
    token: "https://graph.facebook.com/oauth/access_token",
    userinfo: {
      url: "https://graph.facebook.com/me",
      request({ tokens, client }) {
        return client.userinfo(tokens.access_token, {
          params: { fields: "id,name,email,picture" },
        })
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture.data.url,
      }
    },
    ...options,
  }
}
