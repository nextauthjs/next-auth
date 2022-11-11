import { renderPage } from 'vite-plugin-ssr'
import { Request } from 'node-fetch-native'

global.Request = Request

export default async function handler (req, res) {
  const pageContextInit = {
    urlOriginal: req.originalUrl || req.url,
    req,
    res
  }
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext

  if (!httpResponse) {
    res.statusCode = 200
    res.end()
    return
  }

  const { getBody, statusCode, contentType } = httpResponse
  const body = await getBody()
  res.statusCode = statusCode
  res.setHeader('content-type', contentType)
  res.end(body)
}
