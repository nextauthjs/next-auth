// Handle requests to /api/auth/signin
import { getAuthorizationUrl } from '../lib/oauth/signin'

export default (req, res, options, done) => {
  const { provider, providers } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }
  
  if (type === 'oauth' || type === 'oauth2') {
    getAuthorizationUrl(providerConfig, (error, url) => {
      // @TODO Handle error
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