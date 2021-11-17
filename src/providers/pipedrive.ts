import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface PipedriveProfile {
  success: boolean
  data: {
    id: number
    name: string
    default_currency?: string
    locale?: string
    lang?: number
    email: string
    phone?: string
    activated?: boolean
    last_login?: Date
    created?: Date
    modified?: Date
    signup_flow_variation?: string
    has_created_company?: boolean
    is_admin?: number
    active_flag?: boolean
    timezone_name?: string
    timezone_offset?: string
    role_id?: number
    icon_url?: string
    is_you?: boolean
    company_id?: number
    company_name?: string
    company_domain?: string
    company_country?: string
    company_industry?: string
    language?: {
      language_code?: string
      country_code?: string
    }
  }
}

export default function Pipedrive<
  P extends Record<string, any> = PipedriveProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "pipedrive",
    name: "Pipedrive",
    type: "oauth",
    version: "2.0",
    authorization: "https://oauth.pipedrive.com/oauth/authorize",
    token: "https://oauth.pipedrive.com/oauth/token",
    userinfo: "https://api.pipedrive.com/users/me",
    profile: ({ data: profile }) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.icon_url,
      }
    },
    options,
  }
}
