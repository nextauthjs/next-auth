export default (options) => {
  return {
    id: 'netlify',
    name: 'Netlify',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://api.netlify.com/oauth/token',
    authorizationUrl: 'https://app.netlify.com/authorize?response_type=code',
    profileUrl: 'https://api.netlify.com/api/v1/user',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        image: profile.avatar_url
      }
    },
    ...options
  }
}
