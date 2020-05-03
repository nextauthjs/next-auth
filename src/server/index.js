import parseProviders from './lib/providers'
import providers from './routes/providers'
import signin from './routes/signin'
import callback from './routes/callback'
import session from './routes/session'

export default (req, res, _options) => {
  const { url, query } = req
  const {
    slug,
    action = slug[0],
    provider = slug[1],
    serverUrl = 'http://localhost:3000',
    callbackUrl = serverUrl,
    pathPrefix = '/api/auth',
  } = query

  const urlPrefix = `${(serverUrl || '')}${pathPrefix}`

  const options = {
    ..._options,
    urlPrefix: urlPrefix,
    providers: parseProviders(_options.providers, urlPrefix),
    serverUrl,
    action,
    provider,
    callbackUrl,
  }
  
  if (req.method === 'GET') {
    switch (action) {
      case 'providers':
        providers(req, res, options)
        break
      case 'session':
        session(req, res, options)
        break
      case 'signin':
        if (provider && options.providers[provider]) {
          signin(req, res, options)
        } else {
          res.setHeader('Content-Type', 'text/html')
          res.end(`<ul>${
            Object.values(options.providers).map(provider =>
             `<li><a href="${provider.signinUrl}?callbackUrl=${options.callbackUrl}">Signin with ${provider.name}</a></li>`
            ).join('')}</ul>`)
        }
        break
      case 'callback':
        if (provider && options.providers[provider]) {
          callback(req, res, options)
        } else {
          res.statusCode = 400
          res.end(`Error: HTTP GET is not supported for ${url}`)
        }
        break
      case 'unlink':
        break
      case 'signout':
        break
      case 'done':
        res.end(`If you can see this, it worked!`)
      default:
        res.statusCode = 400
        res.end(`Error: HTTP GET is not supported for ${url}`)
    }
  } else if (req.method === 'POST') {
    switch (route) {
      default:
        res.statusCode = 400
        res.end(`Error: HTTP POST is not supported for ${url}`)
    }
  } else {
    res.statusCode = 400
    res.end(`Error: HTTP ${req.method} is not supported for ${url}`)
  }
}