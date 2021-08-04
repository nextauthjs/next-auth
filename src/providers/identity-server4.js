/** @return {import("types/providers").OAuthConfig} */
export default function IdentityServer4(options) {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid profile email" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}
