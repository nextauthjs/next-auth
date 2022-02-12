import type { OAuthConfig, OAuthUserConfig } from "."

export interface BitlyProfile {
  login: string
  name: string
}

export default function Bitly<P extends Record<string, any> = BitlyProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'bitly',
    name: 'Bit.ly',
    type: 'oauth',
    authorization: 'https://bitly.com/oauth/authorize',
    token: 'https://bitly.com/oauth/access_token',
    userinfo: 'https://api-ssl.bitly.com/v4/user',
    profile(profile) {
      return {
        id: profile.login,
        name: profile.name,
      };
    },
    options
  }
}
