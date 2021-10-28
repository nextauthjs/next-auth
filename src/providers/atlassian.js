/** @type {import(".").OAuthProvider} */
export default function Atlassian(options) {
  return {
    id: "atlassian",
    name: "Atlassian",
    type: "oauth",
    wellKnown: "https://auth.atlassian.com/.well-known/openid-configuration",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
