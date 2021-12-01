/** @type {import(".").OAuthProvider} */
export default function Strava(options) {
  return {
    id: "strava",
    name: "Strava",
    type: "oauth",
    authorization: "https://www.strava.com/api/v3/oauth/authorize?scope=read",
    token: "https://www.strava.com/api/v3/oauth/token",
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
