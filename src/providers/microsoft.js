export default (options) => {
  const tenant = options.tenantId ? options.tenantId : 'common'

  return {
    id: 'microsoft',
    name: 'Microsoft',
    type: 'oauth',
    version: '2.0',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    authorizationUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?response_type=code&response_mode=query`,
    profileUrl: 'https://graph.microsoft.com/v1.0/me/',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.userPrincipalName
      }
    },
    ...options
  }
}
