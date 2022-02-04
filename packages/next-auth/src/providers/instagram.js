/**
 * @type {import("src/providers").OAuthProvider} options
 * @example
 *
 * ```js
 * // pages/api/auth/[...nextauth].js
 * import Providers from `next-auth/providers`
 * ...
 * providers: [
 *   Providers.Instagram({
 *     clientId: process.env.INSTAGRAM_CLIENT_ID,
 *     clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
 *   })
 * ]
 * ...
 *
 * // pages/index
 * import { signIn } from "next-auth/react"
 * ...
 * <button onClick={() => signIn("instagram")}>
 *   Sign in
 * </button>
 * ...
 * ```
 * [NextAuth.js Documentation](https://next-auth.js.org/providers/instagram) | [Instagram Documentation](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started) | [Configuration](https://developers.facebook.com/apps)
 */
/** @type {import(".").OAuthProvider} */
export default function Instagram(options) {
  return {
    id: "instagram",
    name: "Instagram",
    type: "oauth",
    authorization:
      "https://api.instagram.com/oauth/authorize?scope=user_profile",
    token: "https://api.instagram.com/oauth/access_token",
    userinfo:
      "https://graph.instagram.com/me?fields=id,username,account_type,name",
    async profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null,
      }
    },
    options,
  }
}
