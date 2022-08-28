import type { OAuthConfig, OAuthUserConfig } from "."

export interface StravaProfile extends Record<string, any> {
  id: string // this is really a number
  username: string
  resource_state: number
  firstname: string
  lastname: string
  bio: string
  city: string
  state?: any
  country?: any
  sex: string
  premium: boolean
  summit: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  weight: number
  profile_medium: string
  profile: string
  friend?: any
  follower?: any
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
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/strava`,
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
