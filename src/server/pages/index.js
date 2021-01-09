import signin from './signin'
import signout from './signout'
import verifyRequest from './verify-request'
import error from './error'
import css from '../../css'

export default function renderPage (req, res) {
  res.setHeader('Content-Type', 'text/html')
  const { baseUrl, basePath } = req.options
  function send (html) {
    res.send(`<!DOCTYPE html><head><style type="text/css">${css()}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div class="page">${html}</div></body></html>`)
  }
  return {
    signin (props) { send(signin({ req, ...props })) },
    signout (props) { send(signout({ ...props, baseUrl, basePath })) },
    verifyRequest (props) { send(verifyRequest({ ...props, baseUrl })) },
    error (props) {
      const html = error({ ...props, res, basePath, baseUrl })
      if (html === false) return res.end()
      send(html)
    }
  }
}
