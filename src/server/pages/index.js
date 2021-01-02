import signin from './signin'
import signout from './signout'
import verifyRequest from './verify-request'
import error from './error'
import css from '../../css'

export default function renderPage (req, res, page, props = {}) {
  props.baseUrl = req.options.baseUrl
  props.basePath = req.options.basePath
  let html = ''
  switch (page) {
    case 'signin':
      html = signin({ ...props, req })
      break
    case 'signout':
      html = signout(props)
      break
    case 'verify-request':
      html = verifyRequest(props)
      break
    case 'error':
      html = error({ ...props, res })
      if (html === false) return res.end()
      break
    default:
      html = error(props)
      return
  }

  res
    .setHeader('Content-Type', 'text/html')
    .send(`<!DOCTYPE html><head><style type="text/css">${css()}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div class="page">${html}</div></body></html>`)
    .end()
}
