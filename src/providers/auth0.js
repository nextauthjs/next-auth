export default (options) => {
  return {
    id: 'auth0',
    name: 'Auth0',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code', respponse_type: 'code' },
    scope: 'openid email profile',
    accessTokenUrl: `https://${options.subdomain}.auth0/oauth/token`,
    authorizationUrl: `https://${options.subdomain}.auth0.com/authorize?`,
    profileUrl: `http://${options.subdomain}.auth0.com/userinfo`,
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture
      }
    },
    ...options
  }
}
