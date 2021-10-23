export default function Pipedrive(options) {
  const ACCESS_TOKEN_URL = "https://oauth.pipedrive.com/oauth/token";
  const AUTHORIZATION_URL = "https://oauth.pipedrive.com/oauth/authorize";
  const PROFILE_URL = "https://api.pipedrive.com/users/me"

  return {
    id: "pipedrive",
    name: "Pipedrive",
    type: "oauth",
    version: "2.0",
    params: { 
      grant_type: "authorization_code",
    },
    accessTokenUrl: ACCESS_TOKEN_URL,
    authorizationUrl: AUTHORIZATION_URL,
    profileUrl: PROFILE_URL,
    authorization: {
      url: AUTHORIZATION_URL,
      params: {
        client_id: options.clientId,
        redirect_uri: options.redirectUri
      }
    },
    token: {
      url: ACCESS_TOKEN_URL
    },
    userinfo: {
      url: PROFILE_URL
    },
    profile: ({ data: profile }) => {
      return profile
    },
    ...options
  }
}