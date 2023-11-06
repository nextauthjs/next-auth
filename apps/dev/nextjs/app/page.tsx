import { SessionProvider } from "@auth/nextjs/react"
import { auth } from "auth"
import Client from "./client"

export default async function Page() {
  const session = await auth()
  return (
    <>
      {/* 
       NOTE: The `auth()` result is not run through the `session` callback, be careful passing down data
       to a client component, this will be exposed via the /api/auth/session endpoint
      */}
      <SessionProvider session={session} basePath="/auth">
        <Client />
      </SessionProvider>
      <h1>Auth.js Example with Next.js</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">Auth.js</a> with Next.js for authentication.
      </p>
    </>
  )
}
