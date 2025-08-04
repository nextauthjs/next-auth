import { signIn, auth } from "auth"
import { SessionProvider } from "next-auth/react"
import Client from "../client"
export default async function Page() {
  const session = await auth()

  return (
    <div className="container">
      <h1>Login Form Sample</h1>
      <p>This sample shows how to login using `auth` module with custom form</p>
      <div className="card">
        <div className="card-header">
          <h3> Login </h3>
        </div>
        <div className="card-body">
          {session ? (
            <pre>{JSON.stringify(session, null, 2)}</pre>
          ) : (
            <form
              action={async (formData) => {
                "use server"
                await signIn("credentials", formData)
              }}
            >
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <div className="btn-wrapper">
                <button>Sign In</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
