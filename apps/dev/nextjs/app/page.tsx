import { SessionProvider } from "next-auth/react"
import { auth, unstable_auth } from "auth"
import Client from "./client"

export default async function Page() {
  const session = await auth()
  const futureAuth = await unstable_auth()
  return (
    <>
      <SessionProvider session={session} basePath="/auth">
        <Client />
      </SessionProvider>
      <b>Server component</b>
      <pre>
        <b>auth() </b>
        {JSON.stringify(session, null, 2)}
      </pre>
      <pre>
        <b>unstable_auth() </b>
        {JSON.stringify(futureAuth, null, 2)}
      </pre>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
      </p>
    </>
  )
}
