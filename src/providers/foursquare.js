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
      url: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,
      request({ tokens, client }) {
        return client.userinfo(undefined, {
          params: { oauth_token: tokens.access_token },
        })
      },
    },
    profile({ response: { profile } }) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: profile.photo
          ? `${profile.photo.prefix}original${profile.photo.suffix}`
          : null,
      }
    },
    options,
  }
}
