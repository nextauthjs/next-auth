import type { OAuthConfig, OAuthUserConfig } from "."

/**
 * @see https://developer.todoist.com/sync/v9/#user
 */
interface TodoistProfile extends Record<string, any> {
  auto_reminder: number
  avatar_big: string
  avatar_medium: string
  avatar_s640: string
  avatar_small: string
  business_account_id: string
  daily_goal: number
  date_format: number
  dateist_inline_disabled: boolean
  dateist_lang: string
  days_off: number[]
  email: string
  features: Record<string, any>
  full_name: string
  has_password: boolean
  id: string
  image_id: string
  inbox_project_id: string
  is_biz_admin: boolean
  is_premium: boolean
  joined_at: boolean
  karma: number
  karma_trend: string
  lang: string
  next_week: number
  premium_until: string
  sort_order: number
  start_day: number
  start_page: string
  team_inbox_id: string
  theme_id: string
  time_format: number
  token: string
  tz_info: Record<string, any>
  weekend_start_day: number
  verification_status: "unverified" | "verified" | "blocked" | "legacy"
}

export default function TodoistProvider<P extends TodoistProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "todoist",
    name: "Todoist",
    type: "oauth",
    authorization: {
      url: "https://todoist.com/oauth/authorize",
      params: { scope: "data:read" },
    },
    token: {
      request: async ({ params }) => {
        // See https://developer.todoist.com/guides/#step-3-token-exchange
        const res = await fetch("https://todoist.com/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: options.clientId,
            client_secret: options.clientSecret,
            code: params.code,
          }),
        })

        const tokens = await res.json()
        return { tokens }
      },
    },
    userinfo: {
      request: async ({ tokens }) => {
        // To obtain Todoist user info, we need to call the Sync API
        // See https://developer.todoist.com/sync/v9
        const res = await fetch("https://api.todoist.com/sync/v9/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sync_token: "*",
            resource_types: '["user"]',
          }),
        })

        const { user: profile } = await res.json()
        return profile
      },
    },
    profile: async (profile) => {
      return {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        image: profile.avatar_big,
      }
    },
    ...options,
  }
}
