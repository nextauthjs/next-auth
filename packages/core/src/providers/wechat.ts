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
import type {
  AuthorizationEndpointHandler,
  OAuthConfig,
  OAuthUserConfig,
  TokenEndpointHandler,
  UserinfoEndpointHandler,
} from "./"

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

export default function WeChat<P extends WeChatProfile>(
  options: OAuthUserConfig<P> & {
    platformType: "OfficialAccount" | "WebsiteApp"
  }
): OAuthConfig<P> {
  const {
    clientId = process.env.AUTH_WECHAT_APP_ID!,
    clientSecret = process.env.AUTH_WECHAT_APP_SECRET!,
    platformType,
  } = options

  if (platformType !== "OfficialAccount" && platformType !== "WebsiteApp") {
    throw new Error("Invalid plaformType")
  }

  const authorizationEndpointUrl =
    platformType === "OfficialAccount"
      ? "https://open.weixin.qq.com/connect/oauth2/authorize"
      : "https://open.weixin.qq.com/connect/qrconnect"
  const authorizationScope =
    platformType === "OfficialAccount" ? "snsapi_userinfo" : "snsapi_login"
  const authorization: AuthorizationEndpointHandler = {
    url: authorizationEndpointUrl,
    params: {
      appid: clientId,
      response_type: "code",
      scope: authorizationScope,
      state: Math.random(),
    },
  }

  const tokenEndpointUrl = "https://api.weixin.qq.com/sns/oauth2/access_token"
  const token: TokenEndpointHandler = {
    url: tokenEndpointUrl,
    params: {
      appid: clientId,
      secret: clientSecret,
      code: "CODE",
      grant_type: "authorization_code",
    },
    conform: async (response: Response) => {
      const data = await response.json()
      response = new Response(
        JSON.stringify({
          ...data,
          // token_type is required by @auth/core
          token_type: "bearer",
        }),
        response
      )
      return response
    },
  }

  const userinfo: UserinfoEndpointHandler = {
    url: "https://api.weixin.qq.com/sns/userinfo",
    request: async ({ tokens, provider }) => {
      const url = new URL(provider.userinfo?.url!)
      url.searchParams.set("access_token", tokens.access_token!)
      url.searchParams.set("openid", String(tokens.openid))
      url.searchParams.set("lang", "zh_CN")
      const response = await fetch(url)
      return response.json()
    },
  }

  const profile = (profile: WeChatProfile) => {
    return {
      id: profile.unionid,
      name: profile.nickname,
      email: null,
      image: profile.headimgurl,
    }
  }

  return {
    id: "wechat",
    name: "WeChat",
    type: "oauth",
    style: { logo: "/wechat.svg", bg: "#fff", text: "#000" },
    checks: ["pkce", "state"],
    clientId,
    clientSecret,
    authorization,
    token,
    userinfo,
    profile,
    options,
  }
}
