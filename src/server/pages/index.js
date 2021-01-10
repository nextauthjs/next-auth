import signin from './signin'
import signout from './signout'
import verifyRequest from './verify-request'
import error from './error'
import css from '../../css'

/** Takes a request and response, and gives renderable pages */
export default function renderPage (req, res) {
  const { baseUrl, basePath, callbackUrl, csrfToken, providers } = req.options

  res.setHeader('Content-Type', 'text/html')
  function send (html) {
    res.send(`<!DOCTYPE html><head><style type="text/css">${css()}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div class="page">${html}</div></body></html>`)
  }

  return {
    signin (props) { send(signin({ csrfToken, providers, callbackUrl, ...req.query, ...props })) },
    signout (props) { send(signout({ csrfToken, baseUrl, basePath, ...props })) },
    verifyRequest (props) { send(verifyRequest({ baseUrl, ...props })) },
    error (props) { send(error({ basePath, baseUrl, res, ...props })) }
  }
}
