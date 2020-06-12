import jwt from 'jsonwebtoken'

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
    getProfileFromToken: true,
    profile: (profile) => {
      return {
        id: profile.sub,
        name: profile.name == null ? profile.sub : profile.name,
        email: profile.email
      }
    },
    clientId: null,
    clientSecret: {
      appleId: null,
      teamId: null,
      privateKey: null,
      keyId: null
    },
    clientSecretCallback: async ({ appleId, keyId, teamId, privateKey }) => {
      const response = jwt.sign(
        {
          iss: teamId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (86400 * 180), // 6 months
          aud: 'https://appleid.apple.com',
          sub: appleId
        },
        privateKey,
        {
          algorithm: 'ES256',
          keyid: keyId
        }
      )
      return Promise.resolve(response)
    },
    ...options
  }
}
