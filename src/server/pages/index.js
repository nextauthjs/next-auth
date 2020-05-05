import signin from './signin'
import fs from 'fs'

// Future releases will support customization (via inline or external CSS)
const defaultStyles = fs.readFileSync(__dirname + '/../../css/index.css', 'utf8')

function render(res, page, props) {
  let html = ''
  switch (page) {
    case 'signin':
      html = signin(props)
      break
    default:
      res.statusCode = 400
      res.end(`Error: HTTP GET is not supported for ${url}`)
      return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html><html><style type="text/css">${defaultStyles}</style><body><div class="page">${html}</div></body></html>`)
}

export default {
  render
}