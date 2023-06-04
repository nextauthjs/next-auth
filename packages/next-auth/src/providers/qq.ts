import type { OAuthConfig, OAuthUserConfig } from "."

export interface TencentQQProfile extends Record<string, any> {
  id: string
  name: string
  email: string
  image: string
}

export default function TencentQQ<P extends TencentQQProfile>(options:OAuthUserConfig<P>) : OAuthConfig<P> {
  return {
    id: "qq",
    name: "QQ",
    type: "oauth",
    authorization: "https://graph.qq.com/oauth2.0/authorize",
    token: {
      url: "https://graph.qq.com/oauth2.0/token",
      async request(context) {
        const response = await fetch('https://graph.qq.com/oauth2.0/token',{
          method: 'POST',
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: context.provider.clientId,
            client_secret: context.provider.clientSecret,
            code: context.params.code,
            redirect_uri: context.provider.callbackUrl,
            fmt: "json",
          }),
        });
        const tokens = await response.json()
        return { tokens }
      },
    },
    userinfo: {
      url: "https://graph.qq.com/oauth2.0/me",
      async request(context) {
        const response = await fetch('https://graph.qq.com/oauth2.0/me?' +
        new URLSearchParams({
          access_token: context.tokens.access_token,
          fmt: 'json'
        }), {
          method: 'GET',
        });
        const openIDInfo = await response.json();
        const userInfoResponse = await fetch('https://graph.qq.com/user/get_user_info?' +
        new URLSearchParams({
          access_token: context.tokens.access_token,
          oauth_consumer_key: openIDInfo.client_id,
          openid: openIDInfo.openid ,
        }), {
          method: 'GET',
        });
        return {...await userInfoResponse.json(), openid: openIDInfo.openid};
      },
    },
    profile(profile) {
      return {
        id: profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.figureurl_qq_2 || profile.figureurl_qq_1
      };
    },
    options
  };
}
