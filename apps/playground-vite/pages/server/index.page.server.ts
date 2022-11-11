// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '@/server/handler'
import type { PageContextServer } from '@/renderer/types'

// https://vite-plugin-ssr.com/data-fetching#onbeforerender
export async function onBeforeRender (pageContext: PageContextServer) {
  const { req, res } = pageContext
  const session = await unstable_getServerSession(req, res, authOptions)

  return {
    pageContext: {
      pageProps: {
        session
      }
    }
  }
}
