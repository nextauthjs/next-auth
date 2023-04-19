/** @type {import(".").OAuthProvider} */
export default function OneLogin(options) {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oidc",
    wellKnown: `${options.issuer}/oidc/2/.well-known/openid-configuration`,
    options,
  }
}
