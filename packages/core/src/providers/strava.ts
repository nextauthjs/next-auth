import type { OAuthConfig, OAuthUserConfig } from "."

export interface StravaProfile extends Record<string, any> {
  id: string // this is really a number
  firstname: string
  lastname: string
  profile: string
}

export default function Strava<P extends StravaProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
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
        name: `${profile.firstname} ${profile.lastname}`,
        email: null,
        image: profile.profile,
      }
    },
    options,
  }
}
