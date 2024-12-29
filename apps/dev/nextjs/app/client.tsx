"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Client() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  return (
    <div className="card">
      <div className="card-header">
        <h3>Client Component</h3>
      </div>
      <div className="card-body">
        <h4>Session</h4>
        <pre>
          {status === "loading"
            ? "Loading..."
            : JSON.stringify(session, null, 2)}
        </pre>
        <div className="btn-wrapper">
          {session ? (
            <>
              <button
                onClick={async () => {
                  await update({ user: { name: "Client Fill Murray" } })
                  router.refresh()
                }}
              >
                Update Session - New Name
              </button>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => signIn("github")}>Sign in GitHub</button>
              <button
                onClick={async () => {
                  await signIn("webauthn", {})
                }}
              >
                Sign in Credentials
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
