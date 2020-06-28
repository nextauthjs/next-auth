import {OAuth2Provider} from "../types";

export interface CognitoProviderOptions {
  clientId: string;
  clientSecret: string;
  domain: string;
}

const CognitoProviderFactory: OAuth2Provider<CognitoProviderOptions> = (options) => {
  const { domain } = options
  return {
    id: 'cognito',
    name: 'Cognito',
    type: 'oauth',
    version: '2.0',
    scope: 'openid profile email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://${domain}/oauth2/token`,
    authorizationUrl: `https://${domain}/oauth2/authorize?response_type=code`,
    profileUrl: `https://${domain}/oauth2/userInfo`,
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.username,
        email: profile.email,
      }
    },
    ...options
  }
}

export default CognitoProviderFactory;