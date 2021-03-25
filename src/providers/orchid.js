export default (options) => {
  return {
    id: 'orcid',
    name: 'Orcid',
    type: 'oauth',
    version: '2.0',
    scope: '/read-limited',
    headers: { 'Accept': 'application/json' },
    params: { grant_type: 'authorization_code' },
    state: false,
    accessTokenUrl: 'https://sandbox.orcid.org/oauth/token',
    authorizationUrl: 'https://sandbox.orcid.org/oauth/authorize?response_type=code',
    profileUrl: 'https://api.sandbox.orcid.org/v3.0/0000-0001-5977-2177/record',
    profile(profile, tokens) {
      return {
        id: tokens.orcid,
        name: tokens.name,
        email: null,
        image: null
      }
    },
    ...options
  }
}
