import { DocSearch } from "@docsearch/react"
import { useTheme } from "nextra-theme-docs"
import { useEffect } from "react"

import "@docsearch/css"

function App() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme) {
      // hack to get DocSearch to use dark mode colors if applicable
      document.documentElement.setAttribute("data-theme", resolvedTheme)
    }
  }, [resolvedTheme])

  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      indexName="next-auth"
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_KEY!}
    />
  )
}

export default App
