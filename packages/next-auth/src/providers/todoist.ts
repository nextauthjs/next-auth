import type { OAuthConfig, OAuthUserConfig } from "."

/**
 * @see https://developer.todoist.com/sync/v9/#user
 */
interface TodoistProfile extends Record<string, any> {
  avatar_big: string
  email: string
  full_name: string
  id: string
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
    token: "https://todoist.com/oauth/access_token",
    client: {
      token_endpoint_auth_method: "client_secret_post",
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
    style: {
      logo: "/todoist.svg",
      logoDark: "/todoist.svg",
      bg: "#fff",
      text: "#E44332",
      bgDark: "#000",
      textDark: "#E44332",
    },
    ...options,
  }
}
