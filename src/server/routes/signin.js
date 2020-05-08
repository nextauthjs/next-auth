// Handle sign in
/*
http://localhost:3000/api/next-auth?action=signin&provider=twitter
http://localhost:3000/api/next-auth?action=signin&provider=google
*/
import { getAuthorizationUrl } from '../lib/oauth/signin'
import cookie from '../lib/cookie'

export default (req, res, options, done) => {
  const {
    provider,
    providers,
    callbackUrl,
    cookies,
  } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }

  // Save callback URL in a cookie (the callback page will read this and redirect to it)
  cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options)
  
  if (type === 'oauth' || type === 'oauth2') {
    getAuthorizationUrl(providerConfig, (error, url) => {
      // @TODO Check error
      if (error) {
        console.error('SIGNIN_ERROR', error)
      }

      res.setHeader('Location', url)
      res.status(302).end()
      return done()
    })
  } else {
    res.status(500).end(`Error: Provider type ${type} not supported`)
    return done()
  }
}