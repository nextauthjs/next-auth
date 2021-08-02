/** @type {import("types/providers").OAuthProvider} */
export default function Foursquare(options) {
  const { apiVersion = "20210801" } = options
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    authorization: "https://foursquare.com/oauth2/authenticate",
    token: "https://foursquare.com/oauth2/access_token",
    userinfo: {
      url: "https://api.foursquare.com/v2/users/self",
      async request({ tokens, client }) {
        const result = await client.userinfo(tokens.access_token, {
          via: "query",
          method: "GET",
          params: { v: apiVersion, oauth_token: tokens.access_token },
        })
        return result.response.user
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: profile.photo
          ? `${profile.photo.prefix}original${profile.photo.suffix}`
          : null,
      }
    },
    ...options,
  }
}
