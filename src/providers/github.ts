import {OAuth2Provider} from "../types";

export interface GitHubProviderOptions {
  clientId: string;
  clientSecret: string;
}

const GitHubProviderFactory: OAuth2Provider<GitHubProviderOptions> = (options) => {
  return {
    id: 'github',
    name: 'GitHub',
    type: 'oauth',
    version: '2.0',
    scope: 'user',
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    profileUrl: 'https://api.github.com/user',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url
      }
    },
    ...options
  }
}

export default GitHubProviderFactory;