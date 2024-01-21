"use client"

import { signIn, useSession } from "next-auth/react"

export default function Client() {
  const { data: session, update, status } = useSession()
  return (
    <div>
      <div>
        <b>Client component</b>
      </div>
      <button onClick={() => signIn("github")}>Sign in</button>
      <button onClick={() => signIn("credentials", {})}>Sign in cred</button>
      <button onClick={() => update(`New Name`)}>Update session</button>
      <pre>
        <b>useSession() </b>
        {status === "loading" ? "Loading..." : JSON.stringify(session, null, 2)}
      </pre>
    </div>
  )
}
