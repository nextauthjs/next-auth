// LinkedIn needs two seperate API calls for user profile and email address
export default (options) => {
  return {
    id: 'linkedin',
    name: 'Linkedin',
    type: 'oauth',
    version: '2.0',
    scope: 'r_emailaddress r_liteprofile',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    authorizationUrl:
      'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
    profileUrl: 'https://api.linkedin.com/v2/me',
    profile: (profile) => {
      // return {
      // };
    },
    ...options,
  };
};
