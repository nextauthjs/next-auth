export default (options) => {
    return {
      id: 'gitlab',
      name: 'GitLab',
      type: 'oauth',
      version: '2.0',
      scope: 'read_user',
      params: { grant_type: 'authorization_code' },
      accessTokenUrl: 'https://gitlab.com/oauth/token',
      authorizationUrl: 'https://gitlab.com/oauth/authorize?response_type=code',
      profileUrl: 'https://gitlab.com/api/v4/user',
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
      ...options
    }
  }
  