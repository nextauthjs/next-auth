/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>WeChat</b> integration.</span>
 * <a href="https://www.wechat.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/wechat.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/wechat
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Get the authenticated user](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html) */
export interface WeChatProfile {
  openid: string
  nickname: string
  sex: number
  province: string
  city: string
  country: string
  headimgurl: string
  privilege: string[]
  unionid: string
  [claim: string]: unknown
}

/**
 * Add WeChat login to your page and make requests to [WeChat APIs](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/wechat
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import WeChat from "@auth/core/providers/wechat"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [WeChat({
 *     clientId: AUTH_WECHAT_APP_ID,
 *     clientSecret: AUTH_WECHAT_APP_SECRET,
 *     platformType: "OfficialAccount",
 *   })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [WeChat Official Account](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
 * - [WeChat Official Account - Webpage Authorization](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)
 * - [WeChat Official Account Test Account](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
 * - [WeChat WebsiteApp Login](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
 * - [使用微信测试账号对网页进行授权](https://cloud.tencent.com/developer/article/1703167)
 *
 * :::tip
 *
 * The WeChat provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/wechat.ts).
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

export default function WeChat(
  options: OAuthUserConfig<WeChatProfile> & {
    platformType?: "OfficialAccount" | "WebsiteApp"
  }
): OAuthConfig<WeChatProfile> {
  const { clientId, clientSecret, platformType = "OfficialAccount" } = options
  console.log(options)
  return {
    id: "wechat",
    name: "WeChat",
    type: "oauth",
    style: { logo: "/wechat.svg", bg: "#fff", text: "#000" },
    checks: ["state"],
    authorization: {
      url:
        platformType === "OfficialAccount"
          ? "https://open.weixin.qq.com/connect/oauth2/authorize"
          : "https://open.weixin.qq.com/connect/qrconnect",
      params: {
        appid: clientId,
        scope:
          platformType === "OfficialAccount"
            ? "snsapi_userinfo"
            : "snsapi_login",
      },
    },
    token: {
      url: "https://api.weixin.qq.com/sns/oauth2/access_token",
      params: { appid: clientId, secret: clientSecret },
      async conform(response) {
        const data = await response.json()
        if (data.token_type === "bearer") {
          console.warn(
            "token_type is 'bearer'. Redundant workaround, please open an issue."
          )
          return response
        }
        return Response.json({ ...data, token_type: "bearer" }, response)
      },
    },
    userinfo: {
      url: "https://api.weixin.qq.com/sns/userinfo",
      async request({ tokens, provider }) {
        if (!provider.userinfo) return

        const url = new URL(provider.userinfo.url)
        url.searchParams.set("access_token", tokens.access_token!)
        url.searchParams.set("openid", String(tokens.openid))
        url.searchParams.set("lang", "zh_CN")
        const response = await fetch(url)
        return response.json()
      },
    },
    profile(profile) {
      return {
        id: profile.unionid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      }
    },
    options,
  }
}
