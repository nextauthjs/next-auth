export default (options) => {
    return {
      id: `${options.id == null ? "identity-server4" : options.id }`,
      name: `${options.name == null ? "IdentityServer4" : options.name }`,
      type: 'oauth',
      version: '2.0',
      scope: `${options.scope == null ? "openid profile email" : options.scope  }`,
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