/**
 * @param {import("../core").Provider} options
 * @example
 *
 * ```js
 * // pages/api/auth/[...nextauth].js
 * import Providers from `next-auth/providers`
 * ...
 * providers: [
 *   Providers.Dropbox({
 *     clientId: process.env.DROPBOX_CLIENT_ID,
 *     clientSecret: process.env.DROPBOX_CLIENT_SECRET
 *   })
 * ]
 * ...
 *
 * // pages/index
 * import { signIn } from "next-auth/react"
 * ...
 * <button onClick={() => signIn("dropbox")}>
 *   Sign in
 * </button>
 * ...
 * ```
 * *Resources:*
 * - [NextAuth.js Documentation](https://next-auth.js.org/providers/dropbox)
 * - [Dropbox Documentation](https://developers.dropbox.com/oauth-guide)
 * - [Configuration](https://www.dropbox.com/developers/apps)
 */
/** @type {import(".").OAuthProvider} */
export default function Dropbox(options) {
  return {
    id: "dropbox",
    name: "Dropbox",
    type: "oauth",
    authorization:
      "https://www.dropbox.com/oauth2/authorize?token_access_type=offline&scope=account_info.read",
    token: "https://api.dropboxapi.com/oauth2/token",
    userinfo: "https://api.dropboxapi.com/2/users/get_current_account",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name.display_name,
        email: profile.email,
        image: profile.profile_photo_url,
      }
    },
    checks: ["state", "pkce"],
    options,
  }
}
