import type { OAuthConfig, OAuthUserConfig } from "."

export interface IWeChatProvider extends Record<string, any>  {
  id: string;
  name: string;
  type: string;
  version: string;
  scope: string;
  params: {
    grant_type: string;
  };
  accessTokenUrl: string;
  authorizationUrl: string;
  profileUrl: string;
  state: boolean;
};

export default function WeChatProvider<P extends IWeChatProvider>(
 options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'wechat',
    name: 'WeChat',
    type: 'oauth',
    version: '2.0',
    scope: 'snsapi_login',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    authorizationUrl:
      `https://open.weixin.qq.com/connect/qrconnect?appid=${options.clientId}` +
      '&redirect_uri=${options.redirectUrl}' +
      '&response_type=code&scope=snsapi_login#wechat_redirect',
    profileUrl: 'https://api.weixin.qq.com/sns/userinfo?openid=',
    profile: (profile: any) => {
      return {
        id: profile.openid,
        name: profile.nickname,
        email: null,
        image: profile.headimgurl,
      };
    },
    state: true,
    options,
  };
};
