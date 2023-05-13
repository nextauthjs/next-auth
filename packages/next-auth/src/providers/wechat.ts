/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Wechat</b> integration.</span>
 * <a href="https://weixin.qq.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/wechat.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/wechat
 */
import type { OAuthConfig, OAuthUserConfig } from "."

export interface WechatProfile extends Record<string, any> {
  openid: string
  nickname: string
  sex: number
  province: string
  city: string
  country: string
  headimgurl: string
  language: string
  privilege: Array<string>
  unionid: string
}

export default function Wechat<P extends WechatProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "wechat",
    name: "Wechat",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://open.weixin.qq.com/connect/oauth2/authorize",
      params: {
        appid: options.clientId,
        scope: "snsapi_base",
      },
      async request({ client, url }) {
        const wechatUrl = new URL(url)
        wechatUrl.searchParams.delete("client_id")
        wechatUrl.hash = "#wechat_redirect"
        return wechatUrl.href
      },
    },
    token: {
      url: "https://api.weixin.qq.com/sns/oauth2/access_token",
      params: {
        appid: options.clientId,
        secret: options.clientSecret,
        grant_type: "authorization_code",
      },
      async request({ provider, client, params, checks }) {
        const response = await client.oauthCallback(
          provider.callbackUrl,
          params,
          checks,
          { exchangeBody: params }
        )
        return { tokens: response }
      },
    },
    userinfo: {
      url: 'https://api.weixin.qq.com/sns/userinfo',
      params: {
        lang: "zh_CN",
      },
      async request({ tokens, client, provider }) {
        const response = await client.userinfo(tokens.access_token!, {
          params: {
            access_token: tokens.access_token,
            openid: tokens.openid,
            // @ts-expect-error
            ...provider.userinfo?.params,
          },
          method: "GET",
        })
        console.log(response)
        return response
      },
    },
    profile(profile) {
      return {
        id: profile.unionid ?? profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      }
    },
    options,
  }
}
