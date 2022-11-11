import { Root, hydrateRoot, createRoot } from 'react-dom/client'
import { Session } from 'next-auth'
import type { PageContextClient } from './types'
import { PageLayout } from './layout'

export const clientRouting = true
export const hydrationCanBeAborted = true

let root: Root

export function render (pageContext: PageContextClient & { session: Session }) {
  const { Page, pageProps, session } = pageContext
  const page = (
    <PageLayout session={session}>
      <Page {...pageProps} />
    </PageLayout>
  )
  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
    root = hydrateRoot(container, page)
  } else {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
  }
}
