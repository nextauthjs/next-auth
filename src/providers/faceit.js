export default (options) => {
  return {
    id: 'faceit',
    name: 'FACEIT',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    headers: {
      Authorization: `Basic ${Buffer.from(`${options.clientId}:${options.clientSecret}`).toString('base64')}`
    },
    accessTokenUrl: 'https://api.faceit.com/auth/v1/oauth/token',
    authorizationUrl: 'https://accounts.faceit.com/accounts?redirect_popup=true&response_type=code',
    profileUrl: 'https://api.faceit.com/auth/v1/resources/userinfo',
    profile (profile) {
      const { guid: id, nickname: name, email, picture: image } = profile
      return {
        id,
        name,
        email,
        image
      }
    },
    ...options
  }
}
