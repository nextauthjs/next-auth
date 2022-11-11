import { getToken } from "next-auth/jwt"
import { unstable_getServerSession } from "next-auth/next"

export default async function Page() {
  const session = await unstable_getServerSession()
  const token = await getToken()
  return (
    <>
      <h2>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <h2>Token</h2>
      <pre>{JSON.stringify(token, null, 2)}</pre>
    </>
  )
}
