import * as React from "react"
import { useSession } from "next-auth/react"
import type { SignInResponse, SignOutResponse } from "next-auth/react"

export default function Page() {
  const [response, setResponse] = React.useState<
    SignInResponse | SignOutResponse
  >()

  const { signIn, signOut, config, data: session } = useSession()

  if (session) {
    return (
      <>
        <h1>Test different flows for Credentials logout</h1>
        <span className="spacing">Default: </span>
        <button onClick={() => signOut({ config })}>Logout</button>
        <br />
        <span className="spacing">No redirect: </span>
        <button onClick={() => signOut({ config, redirect: false }).then(setResponse)}>
          Logout
        </button>
        <br />
        <p>{response ? "Response:" : "Session:"}</p>
        <pre style={{ background: "#eee", padding: 16 }}>
          {JSON.stringify(response ?? session, null, 2)}
        </pre>
      </>
    )
  }

  return (
    <>
      <h1>Test different flows for Credentials login</h1>
      <span className="spacing">Default: </span>
      <button onClick={() => signIn({ config, password: "password" }, "credentials")}>
        Login
      </button>
      <br />
      <span className="spacing">No redirect: </span>
      <button
        onClick={() =>
          signIn({ config, redirect: false, password: "password" }, "credentials").then(
            setResponse
          )
        }
      >
        Login
      </button>
      <br />
      <span className="spacing">No redirect, wrong password: </span>
      <button
        onClick={() =>
          signIn("credentials", { redirect: false, password: "wrong" }).then(
            setResponse
          )
        }
      >
        Login
      </button>
      <p>Response:</p>
      <pre style={{ background: "#eee", padding: 16 }}>
        {JSON.stringify(response, null, 2)}
      </pre>
    </>
  )
}
