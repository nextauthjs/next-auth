export default (options) => {
  return {
    id: 'okta',
    name: 'Okta',
    type: 'oauth',
    version: '2.0',
    scope: 'openid profile email',
    params: {
      grant_type: 'authorization_code',
      client_id: options.clientId,
      client_secret: options.clientSecret
    },
    // These will be different depending on the Org.
    accessTokenUrl: `https://${options.domain}/oauth2/v1/token`,
    authorizationUrl: `https://${options.domain}/oauth2/v1/authorize/?response_type=code`,
    profileUrl: `https://${options.domain}/oauth2/v1/userinfo/`,
    profile: (profile) => {
      return { ...profile, id: profile.sub }
    },
    setGetAccessTokenAuthHeader: false,
    ...options
  }
}
