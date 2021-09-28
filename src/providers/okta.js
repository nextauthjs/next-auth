/** @type {import(".").OAuthProvider} */
export default function Okta(options) {
  return {
    id: "okta",
    name: "Okta",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid email profile" } },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.displayName,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}
