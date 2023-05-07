import { SessionProvider } from "@auth/nextjs/client"
import { auth } from "auth"
import Client from "./client"

export default async function Page() {
  const session = await auth()
  return (
    <>
      <SessionProvider session={session}>
        <Client />
      </SessionProvider>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
      </p>
    </>
  )
}
