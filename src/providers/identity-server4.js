/** @return {import("types/providers").OAuthConfig} */
export default function IdentityServer4(options) {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oauth",
    authorization: `${options.issuer}/connect/authorize?scope=openid+profile+email`,
    token: { url: `${options.issuer}/connect/token`, idToken: true },
    jwks_uri: `${options.issuer}/.well-known/openid-configuration/jwks`,
    profileUrl: `${options.issuer}/connect/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    ...options,
  }
}
