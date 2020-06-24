import signin from './signin'
import signout from './signout'
import verifyRequest from './verify-request'
import error from './error'
import css from '../../css'

function render (req, res, page, props, done) {
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
      html = error(props)
      break
    default:
      html = error(props)
      return
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html><head><style type="text/css">${css()}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div class="page">${html}</div></body></html>`)
  done()
}

export default {
  render
}
