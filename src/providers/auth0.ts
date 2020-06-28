import {OAuth2Provider} from "../types"

export interface AuthOProviderOptions {
  clientId: string;
  clientSecret: string;
  domain: string;
}

const AuthOProviderFactory: OAuth2Provider<AuthOProviderOptions> = (options) => {
  return {
    id: 'auth0',
    name: 'Auth0',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    scope: 'openid email profile',
    accessTokenUrl: `https://${options.domain}/oauth/token`,
    authorizationUrl: `https://${options.domain}/authorize?response_type=code`,
    profileUrl: `https://${options.domain}/userinfo`,
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture
      }
    },
    ...options
  }
}

export default AuthOProviderFactory;