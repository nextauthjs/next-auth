export default (options) => {
  return {
    id: 'keycloak',
    name: 'Keycloak',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    scope: 'openid profile email',
    profile: (profile) => ({ ...profile, id: profile.sub }),
    ...options
  }
}
