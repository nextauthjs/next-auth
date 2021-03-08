/**
 * @param {import("../server").Provider} options
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
 * import { signIn } from "next-auth/client"
 * ...
 * <button onClick={() => signIn("instagram")}>
 *   Sign in
 * </button>
 * ...
 * ```
 * *Resources:*
 * - [NextAuth.js Documentation](https://next-auth.js.org/providers/instagram)
 * - [Instagram Documentation](https://developers.facebook.com/docs/instagram-basic-display-api/getting-started)
 * - [Configuration](https://developers.facebook.com/apps)
 */
export default function Instagram (options) {
  return {
    id: 'instagram',
    name: 'Instagram',
    type: 'oauth',
    version: '2.0',
    scope: 'user_profile',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://api.instagram.com/oauth/access_token',
    authorizationUrl: 'https://api.instagram.com/oauth/authorize?response_type=code',
    profileUrl: 'https://graph.instagram.com/me?fields=id,username,account_type,name',
    async profile (profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null
      }
    }
  }
}
