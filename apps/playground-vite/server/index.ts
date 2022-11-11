import express from 'express'
import { renderPage } from 'vite-plugin-ssr'
import { fetch, Request } from 'node-fetch-native'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next'
import { NextAuthHandler, authOptions } from './handler'

global.fetch = fetch
global.Request = Request

const isProduction = process.env.NODE_ENV === 'production'
// eslint-disable-next-line n/no-path-concat
const root = `${__dirname}/..`

startServer()

async function startServer () {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cookieParser())

  if (isProduction) {
    const sirv = await import('sirv').then(r => r.default || r)
    app.use(sirv(`${root}/dist/client`))
  } else {
    const vite = await import('vite').then(r => r.default || r)
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  app.get('/api/auth/*', NextAuthHandler)
  app.post('/api/auth/*', NextAuthHandler)

  app.get('/api/examples/protected', async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)

    if (session) {
      return res.send({
        content:
          'This is protected content. You can access this content because you are signed in.'
      })
    }

    res.send({
      error: 'You must be signed in to view the protected content on this page.'
    })
  })

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      req,
      res
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) { return next() }
    const body = await httpResponse.getBody()
    res.status(httpResponse.statusCode).type(httpResponse.contentType).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
