/**
 * <div class="provider" style={{backgroundColor: "#d51007", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Last.fm</b> integration.</span>
 * <a href="https://www.last.fm/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/lastfm.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/lastfm
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface LastFMProfile {
  name: string
  realname?: string
  url: string
  image: { "#text": string; size: string }[]
}

/**
 * Add Last.fm login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/lastfm
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import LastFM from "@auth/core/providers/lastfm"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     LastFM({
 *       clientId: LASTFM_API_KEY,
 *       clientSecret: LASTFM_SHARED_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Last.fm API docs](https://www.last.fm/api/authentication)
 * - [Create an API account](https://www.last.fm/api/account/create)
 *
 * ### Notes
 *
 * Last.fm uses a custom authentication flow that is *similar* to OAuth, but requires generating an `api_sig` with your API secret to exchange the temporary token for a session key.
 *
 * :::info
 *
 * This provider assumes you handle the session key exchange manually or through a custom callback, since Auth.js does not support MD5 hashing without adding dependencies.
 *
 * :::
 */
export default function LastFM<P extends LastFMProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "lastfm",
    name: "Last.fm",
    type: "oauth",
    authorization: {
      url: "https://www.last.fm/api/auth",
      params: { api_key: options.clientId },
    },
    token: "https://ws.audioscrobbler.com/2.0/?method=auth.getSession",
    userinfo: {
      url: "https://ws.audioscrobbler.com/2.0/?method=user.getInfo&format=json",
      async request({ tokens }) {
        const res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&api_key=${options.clientId}&sk=${tokens.access_token}&format=json`
        )
        const { user } = await res.json()
        return user
      },
    },
    profile(profile) {
      return {
        id: profile.name,
        name: profile.realname || profile.name,
        email: null,
        image: profile.image?.find((img) => img.size === "large")?.["#text"],
      }
    },
    style: { brandColor: "#d51007" },
    options,
  }
}
