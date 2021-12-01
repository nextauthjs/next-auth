/** @type {import(".").OAuthProvider} */
export default function FusionAuth(options) {
  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oauth",
    authorization: `${options.issuer}oauth2/authorize`,
    token: `${options.issuer}oauth2/token`,
    userinfo: `${options.issuer}oauth2/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
