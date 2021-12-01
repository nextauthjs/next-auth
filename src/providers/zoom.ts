import type { OAuthConfig, OAuthUserConfig } from "."

export interface ZoomProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  type: number
  role_name: string
  pmi: number
  use_pmi: boolean
  vanity_url: string
  personal_meeting_url: string
  timezone: string
  verified: number
  dept: string
  created_at: string
  last_login_time: string
  last_client_version: string
  pic_url: string
  host_key: string
  jid: string
  group_ids: string[]
  im_group_ids: string[]
  account_id: string
  language: string
  phone_country: string
  phone_number: string
  status: string
}

export default function Zoom<P extends Record<string, any> = ZoomProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "zoom",
    name: "Zoom",
    type: "oauth",
    authorization: "https://zoom.us/oauth/authorize?scope",
    token: "https://zoom.us/oauth/token",
    userinfo: "https://api.zoom.us/v2/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.pic_url,
      }
    },
    options,
  }
}
