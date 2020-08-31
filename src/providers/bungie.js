export default (options) => {
  return {
    id: 'bungie',
    name: 'Bungie',
    type: 'oauth',
    version: '2.0',
    scope: '',
    params: { reauth: 'true', grant_type: 'authorization_code' },
    accessTokenUrl: 'https://www.bungie.net/platform/app/oauth/token/',
    requestTokenUrl: 'https://www.bungie.net/platform/app/oauth/token/',
    authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize?response_type=code',
    profileUrl: 'https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/',
    prepareProfileRequest: ({ provider, url, headers, results }) => {
      if (!results.membership_id) {
        // internal error
        // @TODO: handle better
        throw new Error('Expected membership_id to be passed.')
      }

      if (!provider.apiKey) {
        throw new Error('The Bungie provider requires the apiKey option to be present.')
      }

      headers['X-API-Key'] = provider.apiKey
      url = url.replace('{membershipId}', results.membership_id)

      return url
    },
    profile: (profile) => {
      const { bungieNetUser: user } = profile.Response

      return {
        id: user.membershipId,
        name: user.displayName,
        image: `https://www.bungie.net${user.profilePicturePath.startsWith('/') ? '' : '/'}${user.profilePicturePath}`,
        email: null
      }
    },
    apiKey: null,
    clientId: null,
    clientSecret: null,
    ...options
  }
}
