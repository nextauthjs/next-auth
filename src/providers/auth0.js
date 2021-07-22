/** @type {import("types/providers").OAuthProvider} */
export default function Auth0(options) {
  return {
    id: "auth0",
    name: "Auth0",
    type: "oauth",
    authorization: `${options.issuer}authorize?scope=openid+email+profile`,
    jwks_uri: `${options.issuer}.well-known/jwks.json`,
    token: { url: `${options.issuer}oauth/token`, idToken: true },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    ...options,
  }
}
