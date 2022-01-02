/** @type {import(".").OAuthProvider} */
export default function Strava(options) {
  return {
    id: "strava",
    name: "Strava",
    type: "oauth",
    authorization: {
      url: "https://www.strava.com/api/v3/oauth/authorize",
      params: {
        scope: "read",
        approval_prompt: "auto",
        response_type: "code",
        redirect_uri: "http://localhost:3000/api/auth/callback/strava",
      },
    },
    token: {
      url: "https://www.strava.com/api/v3/oauth/token",
    },
    userinfo: "https://www.strava.com/api/v3/athlete",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },

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
