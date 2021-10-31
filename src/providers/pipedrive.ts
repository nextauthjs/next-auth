import { OAuthConfig, OAuthUserConfig } from "./oauth"

interface PipedriveProfile {
  success: boolean
  data: {
    id: number
    name: string
    default_currency: string
    timezone_name: string
    timezone_offset: string
    locale: string
    email: string
    phone: string | null
    created: string
    modified: string
    lang: number
    active_flag: boolean
    is_admin: number
    last_login: string
    signup_flow_variation: string
    role_id: number
    has_created_company: boolean
    icon_url: string | null
    is_you: boolean
    company_id: number
    company_name: string
    company_domain: string
    company_country: string
    language: {
      language_code: string
      country_code: string
    }
  }
}

export default function PipedriveProvider<P extends Record<string, any> = PipedriveProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "pipedrive",
    name: "Pipedrive",
    type: "oauth",
    authorization: "https://oauth.pipedrive.com/oauth/authorize",
    token: "https://oauth.pipedrive.com/oauth/token",
    userinfo: "https://api.pipedrive.com/v1/users/me",
    profile(profile) {
      return {
        id: profile.data.id,
        email: profile.data.email,
        image: profile.data.icon_url,
        name: profile.data.name
      }
    },
    options
  }
}
