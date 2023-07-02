import { OAuthConfig, OAuthUserConfig } from "."

export interface DribbbleProfile extends Record<string, any> {
  id: number
  name: string
  email: string
  avatar_url: string
}

/**
 * ## Documentation
 *
 * [Dribbble API](https://developer.dribbble.com) · [OAuth](https://developer.dribbble.com/v2/oauth/)
 *
 * ## Configuration
 *
 * ### Register application
 *
 * :::tip
 * [`https://dribbble.com/account/applications/new`](https://dribbble.com/account/applications/new)
 * :::
 *
 * Provide the required details about your application:
 *
 * - Name
 * - Description
 * - Website URL
 * - Callback URL
 *   - `https://example.com/api/auth/callback/dribbble` for production
 *   - `http://localhost:3000/api/auth/callback/dribbble` for development
 *
 * Click ‘Register application’
 *
 * The following data is relevant for the next step:
 *
 * - Client ID
 * - Client Secret
 *
 * ### Set up the environment variables
 *
 * ```ini title=".env.local"
 * DRIBBBLE_CLIENT_ID=<copy Client ID value here>
 * DRIBBBLE_CLIENT_SECRET=<copy Client Secret value here>
 * ```
 *
 * ## Example
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import DribbbleProvider from "next-auth/providers/dribbble"
 * ...
 * providers: [
 *   DribbbleProvider({
 *     clientId: process.env.DRIBBBLE_CLIENT_ID,
 *     clientSecret: process.env.DRIBBBLE_CLIENT_SECRET,
 *     scope: 'public upload'
 *   }),
 * ]
 * ...
 * ```
 *
 * :::tip
 * You can optionally set the scope to `public upload` for more advanced scenarios. If omitted, the default `public` scope will be used for authentication purposes.
 * :::
 */

export default function DribbbleProvider<P extends DribbbleProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * Reference: https://developer.dribbble.com/v2/oauth/#scopes
     *
     * For the purposes of NextAuth.js `upload`-only scope makes no sense,
     * therefore it is excluded from suggested values. Treated by Dribbble as `public` when omitted.
     *
     * @default public
     */
    scope?: "public" | "public upload"
  }
): OAuthConfig<P> {
  return {
    id: "dribbble",
    name: "Dribbble",
    type: "oauth",

    authorization: {
      url: "https://dribbble.com/oauth/authorize",
      params: { scope: options.scope },
    },

    token: "https://dribbble.com/oauth/token",
    userinfo: "https://api.dribbble.com/v2/user",

    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      }
    },

    style: {
      // Light mode
      logo: "/dribbble.svg",
      text: "#ea4c89",
      bg: "#fff",
      // Dark mode
      logoDark: "/dribbble-dark.svg",
      textDark: "#fff",
      bgDark: "#000",
    },

    options,
  }
}
