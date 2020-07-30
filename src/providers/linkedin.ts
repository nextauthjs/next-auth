export default (options) => {
  return {
    id: 'linkedin',
    name: 'LinkedIn',
    type: 'oauth',
    version: '2.0',
    scope: 'r_liteprofile',
    params: {
      grant_type: 'authorization_code',
      client_id: options.clientId,
      client_secret: options.clientSecret
    },
    accessTokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
    profileUrl: 'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.localizedFirstName + ' ' + profile.localizedLastName,
        email: null,
        image: null
      }
    },
    ...options
  }
}
