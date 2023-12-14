"use client"

import { signIn, useSession } from "next-auth/react"

export default function Client() {
  const { data: session, update, status } = useSession()
  return (
    <div>
      <pre>
        {status === "loading" ? "Loading..." : JSON.stringify(session, null, 2)}
      </pre>
      <button onClick={() => signIn("github")}>Sign in</button>
      <button onClick={() => signIn("credentials", {})}>Sign in cred</button>
      <button onClick={() => update(`New Name`)}>Update session</button>
    </div>
  )
}
