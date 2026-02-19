/**
 * <div class="provider" style={{backgroundColor: "#53fc18", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>Kick</b> integration.</span>
 * <a href="https://kick.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/kick.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/kick
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

// https://docs.kick.com/apis/users#get-users
export interface KickProfile {
  data: Array<{
    /**
     * Unique identifier for the user.
     */
    user_id: number
    /**
     * Display name of the user.
     */
    name: string
    /**
     * Email address of the user.
     */
    email: string
    /**
     * URL of the user's profile picture.
     */
    profile_picture: string
  }>
  /**
   * Response message from the API.
   */
  message: string
}

/**
 * Add Kick login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/kick
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Kick from "@auth/core/providers/kick"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Kick({
 *       clientId: KICK_CLIENT_ID,
 *       clientSecret: KICK_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Scopes
 *
 * The Kick provider uses the `user:read` scope by default to access basic user information.
 * For a complete list of available scopes and their descriptions, see the
 * [Kick Scopes documentation](https://docs.kick.com/getting-started/scopes).
 *
 * ### Resources
 *
 *  - [Kick Developer documentation](https://docs.kick.com/)
 *  - [Create an OAuth application](https://dev.kick.com/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Kick provider is
 * based on the [OAuth 2.0](https://tools.ietf.org/html/rfc6749) specification.
 *
 * :::tip
 *
 * The Kick provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/kick.ts).
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
export default function Kick(
  options: OAuthUserConfig<KickProfile>
): OAuthConfig<KickProfile> {
  return {
    id: "kick",
    name: "Kick",
    type: "oauth",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      url: "https://id.kick.com/oauth/authorize",
      params: {
        response_type: "code",
        scope: "user:read",
      },
    },
    token: "https://id.kick.com/oauth/token",
    userinfo: "https://api.kick.com/public/v1/users",
    checks: ["pkce", "state"],
    profile(profile) {
      // Extract user data from the API response structure
      const userData = profile.data[0]!
      return {
        id: String(userData.user_id),
        name: userData.name,
        email: userData.email,
        image: userData.profile_picture,
      }
    },
    style: {
      bg: "#53fc18",
      text: "#000",
    },
    options,
  }
}
