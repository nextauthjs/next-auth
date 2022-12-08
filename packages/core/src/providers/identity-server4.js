/** @type {import(".").OAuthProvider} */
export default function IdentityServer4(options) {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oidc",
    options,
  }
}
