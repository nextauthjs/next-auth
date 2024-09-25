import type { OAuthConfig, OAuthUserConfig } from "."

/** @see https://docs.github.com/en/rest/users/users#get-the-authenticated-user */
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

export interface GithubEmail extends Record<string, any> {
  email: string
  primary: boolean
  verified: boolean
  visibility: "public" | "private"
}

export default function Github<P extends GithubProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
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
      async request({ client, tokens }) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const profile = await client.userinfo(tokens.access_token!)

        if (!profile.email) {
          // If the user does not have a public email, get another via the GitHub API
          // See https://docs.github.com/en/rest/users/emails#list-email-addresses-for-the-authenticated-user
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${tokens.access_token}` },
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
    style: { logo: "/github.svg", bg: "#24292f", text: "#fff" },
    options,
  }
}
