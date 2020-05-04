// Handle sign in
/*
http://localhost:3000/api/next-auth?action=signin&provider=twitter
http://localhost:3000/api/next-auth?action=signin&provider=google
*/
import { getAuthorizationUrl } from '../lib/oauth/signin'
import cookie from '../lib/cookie'

export default (req, res, options, resolve) => {
  const {
    provider,
    providers,
    callbackUrl,
    callbackUrlCookieName,
    cookieOptions
  } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  if (!type) {
    res.statusCode = 500
    res.end(`Error: Type not specified for ${provider}`)
    return resolve()
  }

  // Save callback URL in a cookie (the callback page will read this and redirect to it)
  cookie(res, callbackUrlCookieName, callbackUrl, cookieOptions)
  
  if (type === 'oauth' || type === 'oauth2') {
    getAuthorizationUrl(providerConfig, (error, url) => {
      // @TODO Check error
      if (error) {
        console.error('SIGNIN_ERROR', error)
      }

      res.statusCode = 302
      res.setHeader('Location', url)
      res.end()
      return resolve()
    })
  } else {
    res.statusCode = 500
    res.end(`Error: Provider type ${type} not supported`)
    return resolve()
  }
}