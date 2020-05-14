export default (options) => {
  return {
    id: 'mixer',
    name: 'Mixer',
    type: 'oauth',
    version: '2.0',
    scope: 'user:details:self',
    options: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://mixer.com/api/v1/oauth/token',
    authorizationUrl: 'https://mixer.com/oauth/authorize?response_type=code',
    profileUrl: 'https://mixer.com/api/v1/users/current',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.username,
        image: profile.avatarUrl,
        email: profile.email,
      };
    },
    ...options,
  };
};
