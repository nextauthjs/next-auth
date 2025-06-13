/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>TikTok</b> integration.</span>
 * <a href="https://www.tiktok.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/tiktok.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/tiktok
 */
import { customFetch } from "../lib/symbols.js"
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * [More info](https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/)
 */
export interface TiktokProfile {
  data: {
    user: {
      /**
       * The unique identification of the user in the current application.Open id
       * for the client.
       *
       * To return this field, add `fields=open_id` in the user profile request's query parameter.
       */
      open_id: string
      /**
       * The unique identification of the user across different apps for the same developer.
       * For example, if a partner has X number of clients,
       * it will get X number of open_id for the same TikTok user,
       * but one persistent union_id for the particular user.
       *
       * To return this field, add `fields=union_id` in the user profile request's query parameter.
       */
      union_id?: string
      /**
       * User's profile image.
       *
       * To return this field, add `fields=avatar_url` in the user profile request's query parameter.
       */
      avatar_url: string
      /**
       * User`s profile image in 100x100 size.
       *
       * To return this field, add `fields=avatar_url_100` in the user profile request's query parameter.
       */
      avatar_url_100?: string
      /**
       * User's profile image with higher resolution
       *
       * To return this field, add `fields=avatar_url_100` in the user profile request's query parameter.
       */
      avatar_large_url?: string
      /**
       * User's profile name
       *
       * To return this field, add `fields=display_name` in the user profile request's query parameter.
       */
      display_name: string
      /**
       * User's username.
       *
       * To return this field, add `fields=username` in the user profile request's query parameter.
       */
      username: string
      /** @note Email is currently unsupported by TikTok  */
      email?: string
      /**
       * User's bio description if there is a valid one.
       *
       * To return this field, add `fields=bio_description` in the user profile request's query parameter.
       */
      bio_description?: string
      /**
       * The link to user's TikTok profile page.
       *
       * To return this field, add `fields=profile_deep_link` in the user profile request's query parameter.
       */
      profile_deep_link?: string
      /**
       * Whether TikTok has provided a verified badge to the account after confirming
       * that it belongs to the user it represents.
       *
       * To return this field, add `fields=is_verified` in the user profile request's query parameter.
       */
      is_verified?: boolean
      /**
       * User's followers count.
       *
       * To return this field, add `fields=follower_count` in the user profile request's query parameter.
       */
      follower_count?: number
      /**
       * The number of accounts that the user is following.
       *
       * To return this field, add `fields=following_count` in the user profile request's query parameter.
       */
      following_count?: number
      /**
       * The total number of likes received by the user across all of their videos.
       *
       * To return this field, add `fields=likes_count` in the user profile request's query parameter.
       */
      likes_count?: number
      /**
       * The total number of publicly posted videos by the user.
       *
       * To return this field, add `fields=video_count` in the user profile request's query parameter.
       */
      video_count?: number
    }
  }
  error: {
    /**
     * The error category in string.
     */
    code: string
    /**
     * The error message in string.
     */
    message: string
    /**
     * The error message in string.
     */
    log_id: string
  }
}

/**
 * Add TikTok login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/tiktok
 * ```
 *
 * #### Configuration
 * You can omit the client and secret if you have set the `AUTH_TIKTOK_ID` and `AUTH_TIKTOK_SECRET` environment variables.
 * Remeber that the AUTH_TIKTOK_ID is the Client Key in the TikTok Application
 *```ts
 * import { Auth } from "@auth/core"
 * import TikTok from "@auth/core/providers/tiktok"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     TikTok({ clientId: AUTH_TIKTOK_ID, clientSecret: AUTH_TIKTOK_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *  - [TikTok app console](https://developers.tiktok.com/)
 *  - [TikTok login kit documentation](https://developers.tiktok.com/doc/login-kit-web/)
 *  - [Available Scopes](https://developers.tiktok.com/doc/tiktok-api-scopes/)
 *  - [Sandbox for testing](https://developers.tiktok.com/blog/introducing-sandbox)
 *
 *
 * ### Notes
 *
 * :::tip
 *
 * Production applications cannot use localhost URLs to sign in with TikTok. You need add the domain and Callback/Redirect url's to your TikTok app and have them review and approved by the TikTok Team.
 * If you need to test your implementation, you can use the sandbox feature and ngrok for testing in localhost.
 *
 * :::
 *
 * :::tip
 *
 * Email address is not supported by TikTok.
 *
 * :::
 *
 * :::tip
 *
 * AUTH_TIKTOK_ID will be the Client Key in the TikTok Application
 *
 * :::
 *
 * By default, Auth.js assumes that the TikTok provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The TikTok provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/tiktok.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * If You Need to Customize the TikTok Provider, You Can Use the Following Configuration as a custom provider
 *
 * ```ts
 * {
 *   async [customFetch](...args) {
 *     const url = new URL(args[0] instanceof Request ? args[0].url : args[0]);
 *     if (url.pathname.endsWith("/token/")) {
 *       const [url, request] = args;
 *       const customHeaders = {
 *         ...request?.headers,
 *         "content-type": "application/x-www-form-urlencoded",
 *       };
 *
 *       const customBody = new URLSearchParams(request?.body as string);
 *       customBody.append("client_key", process.env.AUTH_TIKTOK_ID!);
 *
 *       const response = await fetch(url, {
 *         ...request,
 *         headers: customHeaders,
 *         body: customBody.toString(),
 *       });
 *       const json = await response.json();
 *       return Response.json({ ...json });
 *     }
 *     return fetch(...args);
 *   },
 *
 *   id: "tiktok",
 *   name: "TikTok",
 *   type: "oauth",
 *   client: {
 *     token_endpoint_auth_method: "client_secret_post",
 *   },
 *
 *   authorization: {
 *     url: "https://www.tiktok.com/v2/auth/authorize",
 *     params: {
 *       client_key: options.clientId,
 *       scope: "user.info.profile", //Add scopes you need eg(user.info.profile,user.info.stats,video.list)
 *     },
 *   },
 *
 *   token: "https://open.tiktokapis.com/v2/oauth/token/",
 *
 *   userinfo: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username", //Add fields you need eg(open_id,avatar_url,display_name,username)
 *
 *   profile(profile) {
 *     return {
 *       id: profile.data.user.open_id,
 *       name: profile.data.user.display_name,
 *       image: profile.data.user.avatar_url,
 *       email: profile.data.user.email || profile.data.user.username || null,
 *     };
 *   },
 * }
 *
 * ```
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
export default function TikTok(
  options: OAuthUserConfig<TiktokProfile>
): OAuthConfig<TiktokProfile> {
  return {
    async [customFetch](...args) {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0])
      if (url.pathname.endsWith("/token/")) {
        const [url, request] = args

        const customHeaders = {
          ...request?.headers,
          "content-type": "application/x-www-form-urlencoded",
        }

        const customBody = new URLSearchParams(request?.body as string)
        customBody.append("client_key", options.clientId!)
        const response = await fetch(url, {
          ...request,
          headers: customHeaders,
          body: customBody.toString(),
        })
        const json = await response.json()
        return Response.json({ ...json })
      }
      return fetch(...args)
    },
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    authorization: {
      url: "https://www.tiktok.com/v2/auth/authorize",
      params: {
        client_key: options.clientId,
        scope: "user.info.basic",
      },
    },

    token: "https://open.tiktokapis.com/v2/oauth/token/",
    userinfo:
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name",

    profile(profile) {
      return {
        id: profile.data.user.open_id,
        name: profile.data.user.display_name,
        image: profile.data.user.avatar_url,
        // Email address is not supported by TikTok.
        email: null,
      }
    },
    style: {
      bg: "#000",
      text: "#fff",
    },
    options,
  }
}
