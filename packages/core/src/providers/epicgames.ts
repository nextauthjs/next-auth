/**
 * Epic Games OAuth Provider
 *
 * This provider uses OAuth 2.0 to authenticate users with their Epic Games account.
 *
 * @see https://authjs.dev/guides/configuring-oauth-providers
 * @see https://dev.epicgames.com/docs/services/en-US/EpicAccountServices
 */

import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

/**
 * The shape of the user object returned by Epic Games when requesting user info.
 * Properties must be adapted based on the exact data the client decides to receive from the Epic Games API.
 */
export interface EpicGamesProfile {
  sub: string;
  preferred_username?: string;
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
    // The internal provider name used by NextAuth/Auth.js
    id: "epicgames",
    // Display name (shown on the default sign-in page)
    name: "Epic Games",
    // Indicates this provider uses OAuth 2.0
    type: "oauth",

    /**
     * The authorization endpoint for Epic Games.
     * Make sure to include the correct scopes and response type.
     */
    authorization: {
      url: "https://www.epicgames.com/id/authorize",
      params: {
        scope: "profile friends_list country", // Adapt it depending your Epic Games App configuration
        response_type: "code",
      },
    },

    /**
     * The token endpoint for exchanging the authorization code for an access token.
     * Includes a Basic Authorization header using clientId/clientSecret.
     */
    token: {
      url: "https://api.epicgames.dev/epic/oauth/v2/token",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${options.clientId}:${options.clientSecret}`
        ).toString("base64")}`,
      },
      params: {
        grant_type: "authorization_code",
      },
    },

    /**
     * The user info endpoint from which to retrieve user details.
     */
    userinfo: "https://api.epicgames.dev/epic/oauth/v2/userInfo",

    /**
     * A function to map the provider's user info response to the Auth.js user object.
     * Must return an object containing at least an `id` property.
     */
    profile(profile: P) {
      return {
        id: profile.sub,
        name: profile.preferred_username ?? profile.sub,
        // country: profile.preferred_language,
      };
    },

    // Merge in the user-supplied configuration (clientId, clientSecret, etc.)
    ...options,
  };
}
