export default (options) => {
  return {
    id: 'atlassian',
    name: 'Atlassian',
    type: 'oauth',
    version: '2.0',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://auth.atlassian.com/oauth/token',
    authorizationUrl:
      'https://auth.atlassian.com/authorize?audience=api.atlassian.com&response_type=code&prompt=consent',
    profileUrl: 'https://api.atlassian.com/me',
    profile: (profile) => {
      return {
        id: profile.account_id,
        name: profile.name,
        email: profile.email,
        image: profile.picture
      }
    },
    ...options
  }
}
