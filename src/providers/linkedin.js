/** @type {import(".").OAuthProvider} */
export default function LinkedIn(options) {
  return {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    authorization:
      "https://www.linkedin.com/oauth/v2/authorization?scope=r_liteprofile",
    token: "https://www.linkedin.com/oauth/v2/accessToken",
    userinfo:
      "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)",
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email: null,
        image: null,
      }
    },
    options,
  }
}
