/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>GitLab</b> integration.</span>
 * <a href="https://gitlab.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/gitlab.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/gitlab
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface GitLabProfile extends Record<string, any> {
  id: number
  username: string
  email: string
  name: string
  state: string
  avatar_url: string
  web_url: string
  created_at: string
  bio: string
  location?: string
  public_email: string
  skype: string
  linkedin: string
  twitter: string
  website_url: string
  organization: string
  job_title: string
  pronouns: string
  bot: boolean
  work_information?: string
  followers: number
  following: number
  local_time: string
  last_sign_in_at: string
  confirmed_at: string
  theme_id: number
  last_activity_on: string
  color_scheme_id: number
  projects_limit: number
  current_sign_in_at: string
  identities: Array<{
    provider: string
    extern_uid: string
  }>
  can_create_group: boolean
  can_create_project: boolean
  two_factor_enabled: boolean
  external: boolean
  private_profile: boolean
  commit_email: string
  shared_runners_minutes_limit: number
  extra_shared_runners_minutes_limit: number
}

/**
 * Add GitLab login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/gitlab
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import GitLab from "@auth/core/providers/gitlab"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     GitLab({ clientId: GITLAB_CLIENT_ID, clientSecret: GITLAB_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [GitLab OAuth documentation](https://docs.gitlab.com/ee/api/oauth2.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the GitLab provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 * Enable the `read_user` option in scope if you want to save the users email address on sign up.
 * :::
 *
 * :::tip
 *
 * The GitLab provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/gitlab.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function GitLab<P extends GitLabProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "gitlab",
    name: "GitLab",
    type: "oauth",
    authorization: "https://gitlab.com/oauth/authorize?scope=read_user",
    token: "https://gitlab.com/oauth/token",
    userinfo: "https://gitlab.com/api/v4/user",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    style: { bg: "#FC6D26", text: "#fff" },
    options,
  }
}
