/**
 * <div class="provider" style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>ClickUp</b> integration.</span>
 * <a href="https://clickup.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/click-up.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/click-up
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Get the authenticated user](https://clickup.com/api/clickupreference/operation/GetAuthorizedUser/)*/
export interface ClickUpProfile {
  user: {
    id: number
    username: string
    color: string
    profilePicture: string
  }
}

/**
 * Add ClickUp login to your page and make requests to [ClickUp APIs](https://clickup.com/api/).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/clickup
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import ClickUp from "@auth/core/providers/click-up"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     ClickUp({
 *       clientId: CLICKUP_CLIENT_ID,
 *       clientSecret: CLICKUP_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [ClickUp - Authorizing OAuth Apps](https://clickup.com/api/developer-portal/authentication#oauth-flow)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/click-up.ts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the ClickUp provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The ClickUp provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/click-up.ts).
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
export default function ClickUp(
  config: OAuthUserConfig<ClickUpProfile>
): OAuthConfig<ClickUpProfile> {
  return {
    id: "click-up",
    name: "ClickUp",
    type: "oauth",
    authorization: "https://app.clickup.com/api",
    token: "https://api.clickup.com/api/v2/oauth/token",
    userinfo: "https://api.clickup.com/api/v2/user",
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    checks: ["state"],
    profile: (profile: ClickUpProfile) => {
      return {
        id: profile.user.id.toString(),
        name: profile.user.username,
        profilePicture: profile.user.profilePicture,
        color: profile.user.color,
      }
    },
    style: {
      bg: "#24292f",
      text: "#fff",
    },
    options: config,
  }
}
