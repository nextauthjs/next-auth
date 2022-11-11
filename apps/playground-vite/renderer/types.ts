import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
// import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router' // When using Client Routing
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

export type PageProps = {}
export type Page = (pageProps: PageProps) => React.ReactElement

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
  req: ExpressRequest
  res: ExpressResponse
  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
export type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom

export type PageContext = PageContextClient | PageContextServer
