/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Spotify</b> integration.</span>
 * <a href="https://www.spotify.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/spotify.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/spotify
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SpotifyImage {
  url: string
}

export interface SpotifyProfile extends Record<string, any> {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
}

/**
 * Add Spotify login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/spotify
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Spotify from "@auth/core/providers/spotify"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Spotify({
 *       clientId: SPOTIFY_CLIENT_ID,
 *       clientSecret: SPOTIFY_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Spotify OAuth documentation](https://developer.spotify.com/documentation/general/guides/authorization-guide)
 * - [Spotify app console](https://developer.spotify.com/dashboard/applications)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Spotify provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Spotify provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/spotify.ts).
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
export default function Spotify<P extends SpotifyProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "spotify",
    name: "Spotify",
    type: "oauth",
    authorization:
      "https://accounts.spotify.com/authorize?scope=user-read-email",
    token: "https://accounts.spotify.com/api/token",
    userinfo: "https://api.spotify.com/v1/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
        image: profile.images?.[0]?.url,
      }
    },
    style: { brandColor: "#1db954" },
    options,
  }
}
