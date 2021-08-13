export default function WeChat(options) {
  return {
    id: "wechat",

    name: "WeChat",
    type: "oauth",
    version: "2.0",
    scope: options.scope,
    params: { grant_type: "authorization_code" },
    authorizationParams: {
      appid: options.clientId
    },
    protection: "state",

    accessTokenUrl: "https://api.weixin.qq.com/sns/oauth2/access_token",
    authorizationUrl:
      "https://open.weixin.qq.com/connect/oauth2/authorize?response_type=code",
    profileUrl: "https://api.weixin.qq.com/sns/userinfo",

    async profile(profile) {
      return {
        id: profile.openid,
        nickname: profile.nickname,
        avatar: profile.headimgurl
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret
  }
}
