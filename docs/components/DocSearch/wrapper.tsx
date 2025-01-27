import { DocSearch } from "@docsearch/react"

import "@docsearch/css"

function App() {
  return (
    <DocSearch
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      indexName="next-auth"
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_KEY!}
    />
  )
}

export default App
