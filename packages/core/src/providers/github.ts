import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface GithubEmail extends Record<string, any> {
  email: string
  primary: boolean
  verified: boolean
  visibility: "public" | "private"
}

/**
 * @see [Get the authenticated user](https://docs.github.com/en/rest/users/users#get-the-authenticated-user)
 */
export interface GithubProfile extends Record<string, any> {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  hireable: boolean | null
  bio: string | null
  twitter_username?: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists?: number
  total_private_repos?: number
  owned_private_repos?: number
  disk_usage?: number
  suspended_at?: string | null
  collaborators?: number
  two_factor_authentication: boolean
  plan?: {
    collaborators: number
    name: string
    space: number
    private_repos: number
  }
}

/**
 * Add GitHub login to your page and make requests to [GitHub APIs](https://docs.github.com/en/rest).
 *
 * ## Example
 *
 * @example
 * ```js
 * import Auth from "@auth/core"
 * import { GitHub } from "@auth/core/providers/github"
 *
 * const request = new Request("https://example.com")
 * const resposne = await AuthHandler(request, {
 *   providers: [
 *     GitHub({clientId: "", clientSecret: ""})
 *   ]
 * })
 * ```
 *
 * ---
 *
 * ## Resources
 * @see [GitHub - Creating an OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
 * @see [GitHub - Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
 * @see [GitHub - Configure your GitHub OAuth Apps](https://github.com/settings/developers)
 * @see [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * @see [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts)
 *
 * ---
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the GitHub provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The GitHub provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/github.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function GitHub<Profile extends GithubProfile>(
  options: OAuthUserConfig<Profile>
): OAuthConfig<Profile> {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization: {
      url: "https://github.com/login/oauth/authorize",
      params: { scope: "read:user user:email" },
    },
    token: "https://github.com/login/oauth/access_token",
    userinfo: {
      url: "https://api.github.com/user",
      async request({ tokens, provider }) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }).then(async (res) => await res.json())

        if (!profile.email) {
          // If the user does not have a public email, get another via the GitHub API
          // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          })

          if (res.ok) {
            const emails: GithubEmail[] = await res.json()
            profile.email = (emails.find((e) => e.primary) ?? emails[0]).email
          }
        }

        return profile
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    style: {
      logo: "/github.svg",
      logoDark: "/github-dark.svg",
      bg: "#fff",
      bgDark: "#000",
      text: "#000",
      textDark: "#fff",
    },
    options,
  }
}
