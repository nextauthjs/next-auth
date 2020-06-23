export default (options) => {
  const { domain } = options;
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
        image: null,
      };
    },
    ...options,
  };
};
