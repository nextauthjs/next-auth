/** @type {import(".").OAuthProvider} */
export default function FACEIT(options) {
  return {
    id: "faceit",
    name: "FACEIT",
    type: "oauth",
    authorization: "https://accounts.faceit.com/accounts?redirect_popup=true",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${options.clientId}:${options.clientSecret}`
      ).toString("base64")}`,
    },
    token: "https://api.faceit.com/auth/v1/oauth/token",
    userinfo: "https://api.faceit.com/auth/v1/resources/userinfo",
    profile(profile) {
      return {
        id: profile.guid,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
