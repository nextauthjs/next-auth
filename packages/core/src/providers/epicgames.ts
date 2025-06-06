/**
 * <div class="provider" style={{backgroundColor: "#fff", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>Epic Games</b> integration.</span>
 * <a href="https://store.epicgames.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/epicgames.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/epicgames
 */

/**
 * @provider EpicGames
 *
 * Epic Games OAuth Provider for Auth.js
 *
 * This provider uses OAuth 2.0 to authenticate users with their Epic Games account.
 *
 * @see [Epic Games OAuth Documentation]
 * (https://dev.epicgames.com/docs/services/en-US/EpicAccountServices)
 * @see [Auth.js OAuth Providers Guide](https://authjs.dev/guides/configuring-oauth-providers)
 *
 * @example
 * ```ts
 * import EpicGamesProvider from "next-auth/providers/epicgames"
 *
 * export default NextAuth({
 *   providers: [
 *     EpicGamesProvider({
 *       clientId: process.env.EPIC_CLIENT_ID,
 *       clientSecret: process.env.EPIC_CLIENT_SECRET,
 *     })
 *   ]
 * })
 * ```
 *
 * ### Environment Variables
 *
 * - `EPIC_CLIENT_ID`
 * - `EPIC_CLIENT_SECRET`
 *
 * ### Profile Response
 *
 * The Epic Games profile has the following structure:
 *
 * ```json
 * {
 *   "sub": "user_id_123",
 *   "preferred_username": "EpicUser123"
 * }
 * ```
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * The shape of the user object returned by Epic Games when requesting user info.
 * Properties must be adapted based on the exact data the client decides to receive from the Epic Games API.
 */
export interface EpicGamesProfile {
  sub: string
  preferred_username?: string
  //   preferred_language?: string;
}

/**
 * Configure the Epic Games OAuth provider.
 *
 * @param {OAuthUserConfig<EpicGamesProfile>} options - User configuration for the Epic Games provider
 * @returns {OAuthConfig<EpicGamesProfile>} - An object conforming to the Auth.js OAuthConfig interface
 *
 * @example
 * ```ts
 * import EpicGamesProvider from "next-auth/providers/epicgames"
 * // ...
 * providers: [
 *   EpicGamesProvider({
 *     clientId: process.env.EPIC_CLIENT_ID,
 *     clientSecret: process.env.EPIC_CLIENT_SECRET,
 *   })
 * ]
 * ```
 */
export default function EpicGamesProvider<P extends EpicGamesProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "epicgames",
    name: "Epic Games",
    type: "oauth",
    authorization: {
      url: "https://www.epicgames.com/id/authorize",
      params: {
        scope: "profile", // profile | friends_list | country | presence
        response_type: "code",
        token_endpoint_auth_method: "client_secret_basic"
      },
    },

    token: {
      url: "https://api.epicgames.dev/epic/oauth/v2/token",
    },

    userinfo: "https://api.epicgames.dev/epic/oauth/v2/userInfo",

    profile(profile: P) {
      return {
        id: profile.sub,
        name: profile.preferred_username ?? profile.sub,
      }
    },

    checks: ["state"],
    // clientId: options.clientId,
    // clientSecret: options.clientSecret,
  }
}
