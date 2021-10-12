/** @type {import(".").OAuthProvider} */
export default function LINE(options) {
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    authorization: { params: { scope: "openid profile" } },
    idToken: true,
    wellKnown: "https://access.line.me/.well-known/openid-configuration",
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
