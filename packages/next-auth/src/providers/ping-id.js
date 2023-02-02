/** @type {import(".").OAuthProvider} */

/*
profile {
  iss: String,
  sub: String,
  aud: String,
  iat: Number,
  exp: Number,
  acr: String,
  amr: [ String ],
  auth_time: Number,
  at_hash: String,
  sid: String,
  preferred_username: String,
  given_name: String,
  picture: String,
  updated_at: Number,
  name: String,
  family_name: String,
  email: String,
  env: String,
  org: String,
  'p1.region': String
}
*/

const PingIdProvider = (options) => {
  return {
    id: "ping-id",
    name: "Ping Identity",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.given_name + " " + profile.family_name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}

export default PingIdProvider;