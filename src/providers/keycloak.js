/** @type {import("types/providers").OAuthProvider} */
export default function Keycloak(options) {
  return {
    id: "keycloak",
    name: "Keycloak",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.preferred_username,
        email: profile.email,
        image: null
      }
    },
    options,
  }
}
