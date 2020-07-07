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
    idToken: true,
    profile: (profile) => {
      // The name of the user will only return on first login
      return {
        id: profile.sub,
        name: profile.user != null ? profile.user.name.firstName + ' ' + profile.user.name.lastName : null,
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
        // Automatically convert \\n into \n if found in private key. If the key
        // is passed in an environment variable \n can get escaped as \\n
        privateKey.replace(/\\n/g, '\n'),
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
