import Layout from "components/layout"
import { providers } from "app/auth"

export default function Page() {
  console.log(providers())
  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://authjs.dev">NextAuth.js</a> for authentication.
      </p>
    </Layout>
  )
}
