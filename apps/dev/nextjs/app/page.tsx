import { auth } from "auth"
import { headers } from "next/headers"
import Client from "./client"

export default async function Page() {
  const session = await auth(headers())
  return (
    <>
      <Client session={session} />
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
      </p>
    </>
  )
}
