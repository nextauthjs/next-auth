export default function Foursquare(options) {
  const { apiVersion } = options
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    authorization: "https://foursquare.com/oauth2/authenticate",
    token: "https://foursquare.com/oauth2/access_token",
    userinfo: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: `${profile.prefix}original${profile.suffix}`,
      }
    },
    ...options,
  }
}
