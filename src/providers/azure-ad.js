export default (options) => {
  return {
    id: 'azure-ad',
    name: 'Azure Active Directory',
    type: 'oauth',
    version: '2.0',
    scope: 'openid',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://login.microsoftonline.com/${options.tenantId}/oauth2/v2.0/token`,
    requestTokenUrl: `https://login.microsoftonline.com/${options.tenantId}/oauth2/v2.0/authorize`,
    authorizationUrl: `https://login.microsoftonline.com/${options.tenantId}/oauth2/v2.0/authorize?response_type=code`,
    profileUrl: 'https://graph.microsoft.com/oidc/userinfo',
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: 'https://graph.microsoft.com/v1.0/me/photo/$value',
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    ...options
  }
}