import {OAuth2Provider} from "../types";

export interface IdentifyServer4ProviderOptions {
  id: string;
  name: string;
  scope: string;
  domain: string;
  clientId: string;
  clientSecret: string;
}

const IdentifyServer4ProviderFactory: OAuth2Provider<IdentifyServer4ProviderOptions> = (options) => {
  return {
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://${options.domain}/connect/token`,
    authorizationUrl: `https://${options.domain}/connect/authorize?response_type=code`,
    profileUrl: `https://${options.domain}/connect/userinfo`,
    profile: (profile) => {
      return { ...profile, id: profile.sub }
    },
    setGetAccessTokenAuthHeader: false,
    ...options
  }
}

export default IdentifyServer4ProviderFactory;