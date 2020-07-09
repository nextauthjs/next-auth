export default (options) => {
  return {
    id: 'twitter',
    name: 'Twitter',
    type: 'oauth',
    version: '1.0A',
    scope: '',
    accessTokenUrl: 'https://api.twitter.com/oauth/access_token',
    requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
    authorizationUrl: 'https://api.twitter.com/oauth/authenticate',
    profileUrl:
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    profile: (profile) => {
      return {
        id: profile.id_str,
        name: profile.name,
        email: profile.email,
        image: profile.profile_image_url_https.replace(/_normal\.jpg$/, '.jpg')
      }
    },
    ...options
  }
}
