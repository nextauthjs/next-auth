// This alternate config for Google oAuth works with the 'client-oauth2' NPM module.
//
// The 'client-oauth2' module is not currently shipped with next-auth, it only supports
// oAuth 2.x and the 'oauth' module supports both oAuth 1.x and 2.x providers, but the
// code to use it, along with this example config, is being left in for reference in
// case it is needed for integration with future providers or in case the oAuth provider
// is swapped out in future.
export default (options) => {
  return {
    id: 'google',
    name: 'Google',
    type: 'oauth2',
    scope: 'profile email',
    accessTokenUrl: 'https://www.googleapis.com/oauth2/v4/token',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    profileUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture
      }
    },
    ...options
  }
}