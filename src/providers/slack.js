export default (options) => {
  return {
    id: 'slack',
    name: 'Slack',
    type: 'oauth',
    version: '2.0',
    scope: 'identity.basic identity.email identity.avatar',
    options: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://slack.com/api/oauth.access',
    authorizationUrl: 'https://slack.com/oauth/authorize?response_type=code',
    profileUrl: 'https://slack.com/api/users.identity',
    profile: (profile) => {
      const { user } = profile
      return {
        id: user.id,
        name: user.name,
        image: user.image_512,
        email: user.email
      }
    },
    ...options
  }
}
