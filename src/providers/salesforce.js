export default (options) => {
  return {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'oauth',
    version: '2.0',
    params: { display: 'page', grant_type: 'authorization_code' },
    accessTokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    authorizationUrl: 'https://login.salesforce.com/services/oauth2/authorize?response_type=code',
    profileUrl: 'https://login.salesforce.com/services/oauth2/userinfo',
    state: false,
    profile: (profile) => {
      return {
        ...profile,
        id: profile.user_id,
        image: profile.picture
      }
    },
    ...options
  }
}
