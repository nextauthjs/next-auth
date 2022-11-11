import { renderToStream } from 'react-streaming/server'
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next'
import { escapeInject } from 'vite-plugin-ssr'
import { PageLayout } from './layout'
import type { PageContextServer } from './types'
import { authOptions } from '@/server/handler'

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'session']

export async function render (pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  // Provide initial session
  const session = await unstable_getServerSession(pageContext.req, pageContext.res, authOptions)

  const stream = await renderToStream(
    <PageLayout session={session}>
      <Page {...pageProps} />
    </PageLayout>,
    // We don't need streaming for a pre-rendered app.
    // (We still use react-streaming to enable <Suspsense>.)
    { disable: true }
  )

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = (documentProps && documentProps.title) || 'Vite SSR app'
  const desc = (documentProps && documentProps.description) || 'nextauth + vite-plugin-ssr'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: (() => {
      return {
        session
      }
    })()
  }
}
