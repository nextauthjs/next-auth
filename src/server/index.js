import parseProviders from './lib/providers'
import providers from './routes/providers'
import signin from './routes/signin'
import callback from './routes/callback'
import session from './routes/session'
import pages from './pages'

const DEFAULT_SITE = ''
const DEFAULT_PATH_PREFIX = '/api/auth'

export default (req, res, _options) => {
  return new Promise(async resolve => {
    const { url, query } = req
    const {
      slug,
      action = slug[0],
      provider = slug[1],
    } = query

    // Allow site name, path prefix to be overriden
    const site = _options.site || DEFAULT_SITE
    const pathPrefix = _options.pathPrefix || DEFAULT_PATH_PREFIX
    const urlPrefix = `${site}${pathPrefix}`

    // If no callback URL is provided, use site name
    const callbackUrl = query.callbackUrl || site

    const cookies = {
      // default cookie options
      sessionId: {
        name: 'next-auth.session-id',
        options: {
          httpOnly: true
        }
      },
      callbackUrl: {
        name: 'next-auth.callback-url',
        options: {}
      },
      urlPrefix: {
        name: 'next-auth.url-prefix',
        options: {
          httpOnly: true
        }
      },
      // Allow user cookie options to override them
      ..._options.cookies
    }
    
    // User provided options are overriden by other options,
    // except for the options with special handlign above
    const options = {
      ..._options,
      site,
      pathPrefix,
      urlPrefix,
      callbackUrl,
      action,
      provider,
      cookies,
      providers: parseProviders(_options.providers, urlPrefix),
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