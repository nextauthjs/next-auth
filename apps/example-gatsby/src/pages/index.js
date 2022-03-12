import * as React from "react"
import Layout from "../components/layout"

import { useSession } from "next-auth/react"

export default function Home() {
  const session = useSession()

  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        An example site to demonstrate how to use{" "}
        <a href="https://next-auth.js.org">NextAuth.js</a> for authentication in
        Gatsby.
      </p>
      {
        {
          loading: <p>Loading session...</p>,
          authenticated: <pre>{JSON.stringify(session?.data, null, 2)}</pre>,
          unauthenticated: "Please sign in",
        }[session?.status ?? "loading"]
      }
    </Layout>
  )
}
