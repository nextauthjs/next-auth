/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Twitter</b> integration.</span>
 * <a href="https://www.twitter.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/twitter.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/twitter
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * [Users lookup](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-me)
 */
export interface TwitterProfile {
  data: {
    /**
     * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
     * that cannot handle large integers.
     */
    id: string
    /** The friendly name of this user, as shown on their profile. */
    name: string
    /** @note Email is currently unsupported by Twitter.  */
    email?: string
    /** The Twitter handle (screen name) of this user. */
    username: string
    /**
     * The location specified in the user's profile, if the user provided one.
     * As this is a freeform value, it may not indicate a valid location, but it may be fuzzily evaluated when performing searches with location queries.
     *
     * To return this field, add `user.fields=location` in the authorization request's query parameter.
     */
    location?: string
    /**
     * This object and its children fields contain details about text that has a special meaning in the user's description.
     *
     *To return this field, add `user.fields=entities` in the authorization request's query parameter.
     */
    entities?: {
      /** Contains details about the user's profile website. */
      url: {
        /** Contains details about the user's profile website. */
        urls: Array<{
          /** The start position (zero-based) of the recognized user's profile website. All start indices are inclusive. */
          start: number
          /** The end position (zero-based) of the recognized user's profile website. This end index is exclusive. */
          end: number
          /** The URL in the format entered by the user. */
          url: string
          /** The fully resolved URL. */
          expanded_url: string
          /** The URL as displayed in the user's profile. */
          display_url: string
        }>
      }
      /** Contains details about URLs, Hashtags, Cashtags, or mentions located within a user's description. */
      description: {
        hashtags: Array<{
          start: number
          end: number
          tag: string
        }>
      }
    }
    /**
     * Indicate if this user is a verified Twitter user.
     *
     * To return this field, add `user.fields=verified` in the authorization request's query parameter.
     */
    verified?: boolean
    /**
     * The text of this user's profile description (also known as bio), if the user provided one.
     *
     * To return this field, add `user.fields=description` in the authorization request's query parameter.
     */
    description?: string
    /**
     * The URL specified in the user's profile, if present.
     *
     * To return this field, add `user.fields=url` in the authorization request's query parameter.
     */
    url?: string
    /** The URL to the profile image for this user, as shown on the user's profile. */
    profile_image_url?: string
    protected?: boolean
    /**
     * Unique identifier of this user's pinned Tweet.
     *
     *  You can obtain the expanded object in `includes.tweets` by adding `expansions=pinned_tweet_id` in the authorization request's query parameter.
     */
    pinned_tweet_id?: string
    created_at?: string
  }
  includes?: {
    tweets?: Array<{
      id: string
      text: string
    }>
  }
  [claims: string]: unknown
}

/**
 * Add Twitter login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/twitter
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Twitter from "@auth/core/providers/twitter"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Twitter({ clientId: TWITTER_CLIENT_ID, clientSecret: TWITTER_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Twitter App documentation](https://developer.twitter.com/en/apps)
 *
 * ## OAuth 2
 * Twitter supports OAuth 2, which is currently opt-in. To enable it, simply add version: "2.0" to your Provider configuration:
 * ```js title="pages/api/auth/[...nextauth].js"
 * TwitterProvider({
 *   clientId: process.env.TWITTER_ID,
 *   clientSecret: process.env.TWITTER_SECRET,
 *   version: "2.0", // opt-in to Twitter OAuth 2.0
 * })
 * ```
 * Keep in mind that although this change is easy, it changes how and with which of Twitter APIs you can interact with. Read the official Twitter OAuth 2 documentation for more details.
 *
 *
 * :::note
 *
 * Email is currently not supported by Twitter OAuth 2.0.
 *
 * :::
 *
 * ### Notes
 *
 * Twitter is currently the only built-in provider using the OAuth 1.0 spec.
 * This means that you won't receive an `access_token` or `refresh_token`, but an `oauth_token` and `oauth_token_secret` respectively. Remember to add these to your database schema, in case if you are using an [Adapter](https://authjs.dev/reference/core/adapters).
 *
 * :::tip
 *
 * You must enable the "Request email address from users" option in your app permissions if you want to obtain the users email address.
 *
 * :::
 *
 * By default, Auth.js assumes that the Twitter provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Twitter provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/twitter.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
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
export default function Twitter(
  config: OAuthUserConfig<TwitterProfile>
): OAuthConfig<TwitterProfile> {
  return {
    id: "twitter",
    name: "Twitter",
    type: "oauth",
    checks: ["pkce", "state"],
    authorization:
      "https://twitter.com/i/oauth2/authorize?scope=users.read tweet.read offline.access",
    token: "https://api.twitter.com/2/oauth2/token",
    userinfo:
      "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
    profile({ data }) {
      return {
        id: data.id,
        name: data.name,
        email: data.email ?? null,
        image: data.profile_image_url,
      }
    },
    style: { logo: "/twitter.svg", bg: "#1da1f2", text: "#fff" },
    options: config,
  }
}
