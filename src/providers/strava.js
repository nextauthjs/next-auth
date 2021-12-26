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
        redirect_uri: "http://localhost:3000/api/auth/callback/strava"
      }
    },
    token: { 
      url: "https://www.strava.com/api/v3/oauth/token",
      async request(context) {
        const response = await fetch(context.provider.token.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...context.params,
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: "authorization_code",
          }),
        });

        const { refresh_token, access_token, token_type, expires_at } = await response.json();

        return {
          tokens: {
            refresh_token,
            access_token,
            token_type, 
            expires_at,
          },
        };
      },
    },
    userinfo: "https://www.strava.com/api/v3/athlete",

    profile(profile) {
      return {
        id: profile.id,
        name: profile.firstname,
        email: null,
        image: profile.profile
      };
    },

    options
  };
}
