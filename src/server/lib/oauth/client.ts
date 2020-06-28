// @TODO Refactor to remove dependancy on 'oauth' package
// It is already quite monkey patched, we don't use all the features and and it
// would be easier to maintain if all the code was native to next-auth.
import { OAuth, OAuth2 } from 'oauth'

export default (provider) => {
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
