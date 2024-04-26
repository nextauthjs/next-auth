import { auth, unstable_update as update } from "auth"
import { SessionProvider } from "next-auth/react"
import Client from "./client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()
  return (
    <div className="container">
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
      </p>
      <div className="card">
        <div className="card-header">
          <h3>Server Action</h3>
        </div>
        <div className="card-body">
          {session ? (
            <form
              action={async () => {
                "use server"
                await update({ user: { name: "Server Fill Murray" } })
                // revalidatePath("/")
                redirect("/")
              }}
            >
              <button>Update Session - New Name</button>
            </form>
          ) : null}
        </div>
        <div className="card-footer">
          Note: The "Sign in" button in the header is using{" "}
          <b>server form actions</b>.
        </div>
      </div>
      {/* 
       NOTE: The `auth()` result is not run through the `session` callback, be careful passing down data
       to a client component, this will be exposed via the /api/auth/session endpoint
      */}
      <SessionProvider session={session} basePath="/auth">
        <Client />
      </SessionProvider>
    </div>
  )
}
