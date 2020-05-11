// The NPM module 'client-oauth2' works well, but only supports oAuth 2.x
// If the NPM installed and the lines in this file uncommented, you can
// use it.
//
// The NPM module 'oauth' supports both oAuth 1.x and oAuth 2.x (and works
// with Google and GitHub) and should be sufficent for most use cases.
//
// However, I'm leaving in the code paths for 'client-oauth2' in case
// there is a need for it - or if the oAuth provider needs to be upgraded
// in future.
//
// import ClientOAuth2 from 'client-oauth2'
import { OAuth, OAuth2 } from 'oauth'

const oAuthClient = (provider) => {
  if (provider.version && provider.version.startsWith('2.')) {
    // Handle oAuth v2.x
    const basePath = new URL(provider.authorizationUrl).origin
    const authorizePath = new URL(provider.authorizationUrl).pathname
    const accessTokenPath = new URL(provider.accessTokenUrl).pathname
    return new OAuth2(
      provider.clientId,
      provider.clientSecret,
      basePath,
      authorizePath,
      accessTokenPath,
      provider.headers)
  } else {
    // Handle oAuth v1.x
    return new OAuth(
      provider.requestTokenUrl,
      provider.accessTokenUrl,
      provider.clientId,
      provider.clientSecret,
      (provider.version || '1.0'),
      provider.callbackUrl,
      (provider.encoding || 'HMAC-SHA1')
    )
  }
}

const oAuth2Client = (provider) => {
  console.error('The provider type oauth2 is not supported. Use "type: \'oauth\'" and specify "version: \'2.0\'" to use oAuth 2.x')
  /*
  return new ClientOAuth2({
    clientId: provider.clientId,
    clientSecret: provider.clientSecret,
    accessTokenUri: provider.accessTokenUrl,
    authorizationUri: provider.authorizationUrl,
    redirectUri: provider.callbackUrl,
    authorizationGrants: provider.authorizationGrants,
    scopes: provider.scope,
  })
  */
}

export {
  oAuthClient,
  oAuth2Client
}
