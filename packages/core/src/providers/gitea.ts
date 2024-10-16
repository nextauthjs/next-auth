/**
 * <div style={{backgroundColor: "#609926", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Gitea</b> integration.</span>
 * <a href="https://gitea.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/gitea.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/gitea
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** @see [Get the authenticated user](https://try.gitea.io/api/swagger#/user/userGetCurrent) */
export interface GiteaProfile extends Record<string, any> {
  sub: string
  preferred_username: string
  name: string
  email: string
  picture: string
  groups: string
  id: string
  login: string
  login_name: string
  full_name: string
  email: string
  avatar_url: string
  language: string
  is_admin: string
  last_login: string
  created: string
  restricted: string
  active: string
  prohibit_login: string
  location: string
  website: string
  description: string
  visibility: string
  followers_count: string
  following_count: string
  starred_repos_count: string
  username: string
}
/**
 * Add Gitea login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/gitea
 * ```
 *
 * #### Configuration
 *
 * ```js
 * import Auth from "@auth/core"
 * import Gitea from "@auth/core/providers/gitea"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Gitea({ clientId: GITEA_CLIENT_ID, clientSecret: GITEA_CLIENT_SECRET, issuer: GITEA_ISSUER })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Gitea OAuth documentation](https://docs.gitea.com/development/oauth2-provider)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Gitea provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * Due to Gitea's decentralized nature, you have to specify the `issuer` you want to connect to.
 *
 * :::tip
 *
 * The Gitea provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/gitea.ts).
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

export default function Gitea<P extends GiteaProfile>(
  options: OIDCUserConfig<P> & {
    issuer: string
  }
): OIDCConfig<P> {
  return {
    id: "gitea",
    name: "Gitea",
    type: "oidc",
    style: { logo: "/gitea.svg", text: "#fff", bg: "#609926" },
    options,
  }
}
