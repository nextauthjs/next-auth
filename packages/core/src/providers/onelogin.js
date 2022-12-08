/** @type {import(".").OAuthProvider} */
export default function OneLogin(options) {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oidc",
    // TODO: Verify if issuer has "oidc/2" and remove if it does
    wellKnown: `${options.issuer}/oidc/2/.well-known/openid-configuration`,
    options,
  }
}
