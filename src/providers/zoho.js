/** @type {import(".").OAuthProvider} */
export default function Zoho(options) {
  return {
    id: "zoho",
    name: "Zoho",
    type: "oauth",
    authorization:
      "https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read",
    token: "https://accounts.zoho.com/oauth/v2/token",
    userinfo: "https://accounts.zoho.com/oauth/user/info",
    profile(profile) {
      return {
        id: profile.ZUID,
        name: `${profile.First_Name} ${profile.Last_Name}`,
        email: profile.Email,
        image: null,
      }
    },
    options,
  }
}
