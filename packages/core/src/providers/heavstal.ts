import type { OAuthConfig, OAuthUserConfig } from "../types.js"

/**
 * The returned user profile from Heavstal Tech.
 */
export interface HeavstalProfile extends Record<string, any> {
  /** The unique Heavstal User ID */
  sub: string
  /** The user's public display name */
  name: string
  /** The user's verified email address */
  email: string
  /** The user's profile picture URL */
  picture: string
}

/**
 * Add Heavstal login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/heavstal
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Heavstal from "@auth/core/providers/heavstal"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {
 *   providers: [
 *     Heavstal({
 *       clientId: process.env.HEAVSTAL_CLIENT_ID,
 *       clientSecret: process.env.HEAVSTAL_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Heavstal Developer Console](https://heavstal-tech.vercel.app/oauth/apps)
 * - [Heavstal API Documentation](https://heavstal-tech.vercel.app/docs/api/oauth-guide)
 */
export default function Heavstal(
  options: OAuthUserConfig<HeavstalProfile>
): OAuthConfig<HeavstalProfile> {
  return {
    id: "heavstal",
    name: "Heavstal",
    type: "oidc",
    issuer: "https://accounts-heavstal.vercel.app",
    style: {
      logo: "/providers/heavstal.svg",
      bg: "#000",
      text: "#fff",
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
