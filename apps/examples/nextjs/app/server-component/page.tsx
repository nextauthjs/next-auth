import { auth } from "auth"
import { cookies, headers } from "next/headers"

function SignIn({ id, children, className }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  return (
    <form action={`/api/auth/signin/${id}`} method="post">
      <button className={className} type="submit">{children}</button>
      <input type="hidden" name="csrfToken" value={csrfToken} />
    </form>
  )
}

function SignOut({ children }: any) {
  const $cookies = cookies()
  const csrfToken = $cookies.get("next-auth.csrf-token")?.value.split("|")[0]
  return (
    <form action="/api/auth/signout" method="post">
      <button type="submit">{children}</button>
      <input type="hidden" name="csrfToken" value={csrfToken} />
    </form>
  )
}

export default async function Page() {
  const session = await auth(headers())
  if (session) {
    return (
      <>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <SignOut>Sign out</SignOut>
      </>
    )
  }
  return <SignIn id="github">Sign in with github</SignIn>
}

export const runtime = "experimental-edge"
