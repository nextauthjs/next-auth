/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Threads</b> integration.</span>
 * <a href="https://www.threads.net/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/threads.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/threads
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * [User](https://developers.facebook.com/docs/threads/reference/user)
 */
export interface ThreadsProfile {
  data: {
    /**
     * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
     * that cannot handle large integers.
     */
    id: string
    /**
     * The Threads handle (username) of this user.
     *
     * To return this field, add `fields=username` in the authorization request's query parameter.
     */
    username?: string
    /**
     * The URL to the profile image for this user, as shown on the user's profile.
     *
     * To return this field, add `fields=threads_profile_picture_url` in the authorization request's query parameter.
     */
    threads_profile_picture_url?: string
    /**
     * The text of this user's profile biography (also known as bio), if the user provided one.
     *
     * To return this field, add `fields=threads_biography` in the authorization request's query parameter.
     */
    threads_biography?: string
  }
}

/**
 * Add Threads login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/threads
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Threads from "@auth/core/providers/threads"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Threads({
 *       clientId: THREADS_CLIENT_ID,
 *       clientSecret: THREADS_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Threads OAuth documentation](https://developers.facebook.com/docs/threads)
 * - [Threads OAuth apps](https://developers.facebook.com/apps/)
 *
 * ### Notes
 *
 * :::warning
 *
 * Email address is not returned by the Threads API.
 *
 * :::
 *
 * :::tip
 *
 * Threads required callback URL to be configured in your Facebook app and Facebook required you to use **https** even for localhost! In order to do that, you either need to [add an SSL to your localhost](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) or use a proxy such as [ngrok](https://ngrok.com/docs).
 *
 * :::
 *
 * By default, Auth.js assumes that the Threads provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Threads provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/threads.ts).
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
export default function Threads(
  config: OAuthUserConfig<ThreadsProfile>
): OAuthConfig<ThreadsProfile> {
  return {
    id: "threads",
    name: "Threads",
    type: "oauth",
    checks: ["state"],
    authorization: "https://threads.net/oauth/authorize?scope=threads_basic",
    token: "https://graph.threads.net/oauth/access_token",
    userinfo:
      "https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile({ data }) {
      return {
        id: data.id,
        name: data.username || null,
        email: null,
        image: data.threads_profile_picture_url || null,
      }
    },
    style: { bg: "#000", text: "#fff" },
    options: config,
  }
}
