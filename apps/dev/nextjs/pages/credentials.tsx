import * as React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { SignInResponse, SignOutResponse } from "next-auth/react"

export default function Page() {
  const [response, setResponse] = React.useState<
    SignInResponse | SignOutResponse
  >()

  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <h1>Test different flows for Credentials logout</h1>
        <span className="spacing">Default: </span>
        <button onClick={() => signOut()}>Logout</button>
        <br />
        <span className="spacing">No redirect: </span>
        <button onClick={() => signOut({ redirect: false }).then(setResponse)}>
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
      <button onClick={() => signIn("credentials", { password: "password" })}>
        Login
      </button>
      <br />
      <span className="spacing">No redirect: </span>
      <button
        onClick={() =>
          signIn("credentials", { redirect: false, password: "password" }).then(
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
