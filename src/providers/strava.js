/** @type {import(".").OAuthProvider} */
export default function Strava(options) {
  return {
    id: "strava",
    name: "Strava",
    type: "oauth",
    authorization: "https://www.strava.com/oauth/authorize?scope=read&approval_prompt=auto",
    token: "https://www.strava.com/oauth/token",
    userinfo: "https://www.strava.com/api/v3/athlete",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.firstname,
        email: null,
        image: profile.profile,
      }
    },
    options,
  }
}
