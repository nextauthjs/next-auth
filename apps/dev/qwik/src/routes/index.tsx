import { component$ } from "@builder.io/qwik"
import { Form, type RequestHandler } from "@builder.io/qwik-city"
import { useSession, useSignIn, useSignOut } from "./plugin@auth"

export const onRequest: RequestHandler = (event) => {
  const session = event.sharedMap.get("session")
  if (!session || new Date(session.expires) < new Date()) {
    console.log("Not authorize. Redirect or throw error here.")
  }
}

export default component$(() => {
  const signIn = useSignIn()
  const signOut = useSignOut()
  const session = useSession()
  return (
    <>
      <Form action={signIn}>
        <input type="hidden" name="providerId" value="github" />
        <input
          type="hidden"
          name="options.callbackUrl"
          value="http://qwik-auth-example.com/dashboard"
        />
        <button>Sign In</button>
      </Form>
      Session: {JSON.stringify(session.value)}
      <br />
      <button onClick$={() => signOut.submit({ callbackUrl: "/" })}>
        Sign Out
      </button>
    </>
  )
})
