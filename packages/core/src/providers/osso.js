/** @type {import(".").OAuthProvider} */
export default function Osso(options) {
  return {
    id: "osso",
    name: "Osso",
    type: "oauth",
    authorization: `${options.issuer}oauth/authorize`,
    token: `${options.issuer}oauth/token`,
    userinfo: `${options.issuer}oauth/me`,
    options,
  }
}
