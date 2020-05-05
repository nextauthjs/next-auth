import parseProviders from './lib/providers'
import providers from './routes/providers'
import signin from './routes/signin'
import callback from './routes/callback'
import session from './routes/session'
import pages from './pages'

export default (req, res, _options) => {
  return new Promise(async resolve => {
    const { url, query } = req
    const {
      slug,
      action = slug[0],
      provider = slug[1],
      site = 'http://localhost:3000',
      callbackUrl = site,
      pathPrefix = '/api/auth',
    } = query

    const urlPrefix = `${(site || '')}${pathPrefix}`

    const options = {
      sessionIdCookieName: 'session-id',
      callbackUrlCookieName: 'callback-url',
      cookieOptions: {},
      ..._options,
      urlPrefix: urlPrefix,
      providers: parseProviders(_options.providers, urlPrefix),
      site,
      action,
      provider,
      callbackUrl,
    }
    
    if (req.method === 'GET') {
      switch (action) {
        case 'providers':
          providers(req, res, options, resolve)
          break
        case 'session':
          session(req, res, options, resolve)
          break
        case 'signin':
          if (provider && options.providers[provider]) {
            signin(req, res, options, resolve)
          } else {
            pages.render(res, 'signin', {
              providers: Object.values(options.providers),
              callbackUrl: options.callbackUrl
            })
          }
          break
        case 'callback':
          if (provider && options.providers[provider]) {
            callback(req, res, options, resolve)
          } else {
            res.statusCode = 400
            res.end(`Error: HTTP GET is not supported for ${url}`)
            return resolve()
          }
          break
        case 'unlink':
          break
        case 'signout':
          break
        case 'done':
          res.end(`If you can see this, it worked!`)
          return resolve()
        default:
          res.statusCode = 400
          res.end(`Error: HTTP GET is not supported for ${url}`)
          return resolve()
      }
    } else if (req.method === 'POST') {
      switch (route) {
        default:
          res.statusCode = 400
          res.end(`Error: HTTP POST is not supported for ${url}`)
          return resolve()
      }
    } else {
      res.statusCode = 400
      res.end(`Error: HTTP ${req.method} is not supported for ${url}`)
      return resolve()
    }
  })
}