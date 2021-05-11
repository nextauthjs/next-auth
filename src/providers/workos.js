export default function WorkOS(options) {
  return {
    id: 'workos',
    name: 'WorkOS',
    type: 'oauth',
    version: '2.0',
    scope: '',
    params: {
      grant_type: 'authorization_code',
      client_id: options.clientId,
      client_secret: options.clientSecret
    },
    accessTokenUrl: 'https://api.workos.com/sso/token/',
    authorizationUrl: `https://api.workos.com/sso/authorize/?response_type=code&domain=${options.domain}`,
    profileUrl: 'https://api.workos.com/sso/profile/',
    profile: (profile) => {
      return {
        ...profile,
        name: `${profile.first_name} ${profile.last_name}`
      }
    },
    ...options
  }
}
