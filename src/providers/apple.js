export default (options) => {
  return {
    id: 'apple',
    name: 'Apple',
    type: 'oauth',
    version: '2.0',
    scope: 'name email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://appleid.apple.com/auth/token',
    authorizationUrl: 'https://appleid.apple.com/auth/authorize?response_type=code&id_token&response_mode=form_post',
    profileUrl: null,
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.name == null ? profile.sub : profile.name,
        email: profile.email
      }
    },
    ...options
  }
}
