/** @type {import(".").OAuthProvider} */
export default function LINE(options) {
  const { client, ...rest } = options;
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    authorization: { params: { scope: "openid profile" } },
    idToken: true,
    wellKnown: "https://access.line.me/.well-known/openid-configuration",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    client: {
      id_token_signed_response_alg: "HS256",
      ...client
    },
    ...rest,
  }
}
