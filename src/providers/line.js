/** @type {import(".").OAuthProvider} */
export default function LINE(options) {
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    authorization: { params: { scope: "openid profile" } },
    idToken: true,
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: null,
        image: profile.picture,
      }
    },
    options,
  }
}
