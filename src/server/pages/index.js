import fs from 'fs'
import signin from './signin'
import signout from './signout'
import error from './error'

// Future releases will support customization (via inline or external CSS)
const defaultStyles = fs.readFileSync(__dirname + '/../../css/index.css', 'utf8')

function render(res, page, props, done) {
  let html = ''
  switch (page) {
    case 'signin':
      html = signin(props)
      break
    case 'signout':
      html = signout(props)
      break
    case 'error':
      html = error(props)
      break;
    default:
      res.status(400).end(`Error: HTTP GET is not supported for ${url}`)
      return
  }

  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html><html><head><style type="text/css">${defaultStyles}</style><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div class="page">${html}</div></body></html>`)
  done()
}

export default {
  render
}