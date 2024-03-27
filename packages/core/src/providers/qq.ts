/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Tencent QQ</b> integration.</span>
 * <a href="https://im.qq.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/qq.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/qq
 */

import type { OAuthConfig, OAuthUserConfig } from "."

export interface TencentQQProfile extends Record<string, any> {
  id: string
  name: string
  email: string
  image: string
}

/**
 * Add Tencent QQ login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/qq
 * ```
 *
 * #### Configuration
 *
 *
 *```js
 * import Auth from "@auth/core"
 * import TencentQQProvider from "next-auth/providers/qq";
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *    TencentQQProvider({
 *      clientId: process.env.TENCENT_ID,
 *      clientSecret: process.env.TENCENT_SECRET,
 *    }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [QQ OAuth documentation](https://wiki.connect.qq.com/准备工作_OAuth2.0)
 *  - [QQ OAuth configuration](https://connect.qq.com/manage.html#/)
 *
 * ### Notes
 * By default, Auth.js assumes that the Tencent QQ provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Tencent QQ provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/qq.ts).
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

export default function TencentQQ<P extends TencentQQProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "qq",
    name: "QQ",
    type: "oauth",
    authorization: "https://graph.qq.com/oauth2.0/authorize",
    token: {
      url: "https://graph.qq.com/oauth2.0/token",
      async request(context) {
        const response = await fetch("https://graph.qq.com/oauth2.0/token", {
          method: "POST",
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: context.provider.clientId,
            client_secret: context.provider.clientSecret,
            code: context.params.code,
            redirect_uri: context.provider.callbackUrl,
            fmt: "json",
          }),
        })
        const tokens = await response.json()
        return { tokens }
      },
    },
    userinfo: {
      url: "https://graph.qq.com/oauth2.0/me",
      async request(context) {
        const response = await fetch(
          "https://graph.qq.com/oauth2.0/me?" +
            new URLSearchParams({
              access_token: context.tokens.access_token || "",
              fmt: "json",
            })
        )
        const openIDInfo = await response.json()
        const userInfoResponse = await fetch(
          "https://graph.qq.com/user/get_user_info?" +
            new URLSearchParams({
              access_token: context.tokens.access_token || "",
              oauth_consumer_key: openIDInfo.client_id,
              openid: openIDInfo.openid,
            })
        )
        return { ...(await userInfoResponse.json()), openid: openIDInfo.openid }
      },
    },
    profile(profile) {
      return {
        id: profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.figureurl_qq_2 || profile.figureurl_qq_1,
      }
    },
    options,
  }
}
