export default (options) => {
  return {
    id: 'osso',
    name: 'SAML SSO',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://${options.domain}/oauth/token`,
    authorizationUrl: `https://${options.domain}/oauth/authorize?response_type=code&domain=vcardme.com`,
    profileUrl: `https://${options.domain}/oauth/me`,
    profile: (profile) => {
      return {
        id: profile.id,
        name: null,
        email: profile.email,
        image: null
      }
    },
    ...options
  }
}
