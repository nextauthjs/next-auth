/**
 * <div class="provider" style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
 * <span>Built-in <b>Bitbucket</b> integration.</span>
 * <a href="https://bitbucket.org">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/bitbucket.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/bitbucket
 */

import { OAuthConfig, OAuthUserConfig } from "./index.js"

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

/**
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get
 */
export interface BitbucketProfile {
  display_name: string
  links: Record<
    LiteralUnion<
      "self" | "avatar" | "repositories" | "snippets" | "html" | "hooks"
    >,
    { href?: string }
  >
  created_on: string
  type: string
  uuid: string
  has_2fa_enabled: boolean | null
  username: string
  is_staff: boolean
  account_id: string
  nickname: string
  account_status: string
  location: string | null
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 *
 * ```ts
 * https://example.com/api/auth/callback/bitbucket
 * ```
 *
 * #### Configuration
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Bitbucket from "@auth/core/providers/bitbucket"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Bitbucket({
 *       clientId: process.env.BITBUCKET_CLIENT_ID,
 *       clientSecret: process.env.BITBUCKET_CLIENT_SECRET,
 *     })
 *   ],
 * })
 * ```
 *
 * #### Resources
 *
 * - [Using OAuth on Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/)
 * - [Bitbucket REST API Authentication](https://developer.atlassian.com/cloud/bitbucket/rest/intro/#authentication)
 * - [Bitbucket REST API Users](https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-group-users)
 *
 *  #### Notes
 *
 * By default, Auth.js assumes that the Bitbucket provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Bitbucket provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/bitbucket.ts).
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
export default function Bitbucket(
  options: OAuthUserConfig<BitbucketProfile>
): OAuthConfig<BitbucketProfile> {
  return {
    id: "bitbucket",
    name: "Bitbucket",
    type: "oauth",
    authorization: {
      url: "https://bitbucket.org/site/oauth2/authorize",
      params: {
        scope: "account",
      },
    },
    token: "https://bitbucket.org/site/oauth2/access_token",
    userinfo: "https://api.bitbucket.org/2.0/user",
    profile(profile) {
      return {
        name: profile.display_name ?? profile.username,
        id: profile.account_id,
        image: profile.links.avatar?.href,
      }
    },
    options,
    style: {
      text: "#fff",
      bg: "#205081",
    },
  }
}
