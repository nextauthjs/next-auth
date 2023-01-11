import type { OAuthConfig, OAuthUserConfig } from "./oauth"

/** @see [Get a user](https://api.mattermost.com/#tag/users/operation/GetUser) */
export interface MattermostProfile {
  id: string
  /** The time in milliseconds a user was created */
  create_at: number
  /** The time in milliseconds a user was last updated */
  update_at: number
  /** The time in milliseconds a user was deleted */
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
    /** Set to "true" to enable channel-wide notifications (@channel, @all, etc.), "false" to disable. Defaults to "true". */
    channel: string
    comments: string
    /** Set to "all" to receive desktop notifications for all activity, "mention" for mentions and direct messages only, and "none" to disable. Defaults to "all". */
    desktop: string
    /** Set to "true" to enable sound on desktop notifications, "false" to disable. Defaults to "true". */
    desktop_sound: string
    desktop_threads: string
    /** Set to "true" to enable email notifications, "false" to disable. Defaults to "true". */
    email: string
    email_threads: string
    /** Set to "true" to enable mentions for first name. Defaults to "true" if a first name is set, "false" otherwise. */
    first_name: string
    /** A comma-separated list of words to count as mentions. Defaults to username and @username. */
    mention_keys: string
    /** Set to "all" to receive push notifications for all activity, "mention" for mentions and direct messages only, and "none" to disable. Defaults to "mention". */
    push: string
    push_status: string
    push_threads: string
  }
  last_password_update: number
  locale: string
  timezone: {
    /** This value is set automatically when the "useAutomaticTimezone" is set to "true". */
    automaticTimezone: string
    /** Value when setting manually the timezone, i.e. "Europe/Berlin". */
    manualTimezone: string
    /** Set to "true" to use the browser/system timezone, "false" to set manually. Defaults to "true". */
    useAutomaticTimezone: string
  }
  disable_welcome_email: boolean
  /** ID of accepted terms of service, if any. This field is not present if empty. */
  terms_of_service_id?: string
  /** The time in milliseconds the user accepted the terms of service */
  terms_of_service_create_at?: number
}

/**
 * To create your Mattermost OAuth2 app visit http://`<your Mattermost instance url>`/`<your team>`/integrations/oauth2-apps
 *
 * ## Example
 *
 * ```ts
 * import Mattermost from "@auth/core/providers/mattermost";
 * ...
 * providers: [
 *   Mattermost({
 *     clientId: env.MATTERMOST_ID,
 *     clientSecret: env.MATTERMOST_SECRET,
 *     // The base url of your Mattermost instance. e.g https://my-cool-server.cloud.mattermost.com
 *     issuer: env.MATTERMOST_ISSUER,
 *   })
 * ]
 * ...
 * ```
 *
 * :::warning
 * The Mattermost provider requires the `issuer` option to be set. This is the base url of your Mattermost instance. e.g https://my-cool-server.cloud.mattermost.com
 * :::
 */
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
