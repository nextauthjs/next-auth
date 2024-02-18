import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start"
import { Suspense } from "solid-js"
import "./app.css"

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider tags={[]}>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
