import type { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface MattermostProfile {
  id: string
  create_at: number
  update_at: number
  delete_at: number
  username: string
  auth_data: string
  auth_service: string
  email: string
  email_verified: boolean
  nickname: string
  first_name: string
  last_name: string
  position: string
  roles: string
  notify_props: {
    channel: string
    comments: string
    desktop: string
    desktop_sound: string
    desktop_threads: string
    email: string
    email_threads: string
    first_name: string
    mention_keys: string
    push: string
    push_status: string
    push_threads: string
  }
  last_password_update: number
  locale: string
  timezone: {
    automaticTimezone: string
    manualTimezone: string
    useAutomaticTimezone: string
  }
  disable_welcome_email: boolean
}

export default function Mattermost<P extends MattermostProfile>(
  config: OAuthUserConfig<P> & { issuer: string }
): OAuthConfig<P> {
  const { issuer, ...rest } = config

  return {
    id: "mattermost",
    name: "Mattermost",
    type: "oauth",
    client: { token_endpoint_auth_method: "client_secret_post" },
    token: `${issuer}/oauth/access_token`,
    authorization: `${issuer}/oauth/authorize`,
    userinfo: `${issuer}/api/v4/users/me`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username ?? `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: null,
      }
    },
    style: {
      logo: "/mattermost.svg",
      logoDark: "/mattermost-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options: rest,
  }
}
