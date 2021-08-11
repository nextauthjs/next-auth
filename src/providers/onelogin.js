/** @returns {import("types/providers").OAuthConfig} */
export default function OneLogin(options) {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oauth",
    wellKnown: `${options.issuer}/oidc/2/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid profile email" } },
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
