import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { unstable_getServerSession } from "next-auth/next"

type SessionWithToken = Session & { token: JWT }

export default async function Page() {
  const { token, ...session } =
    await unstable_getServerSession<SessionWithToken>({
      providers: [],
      callbacks: {
        session: ({ session, token }) => ({ ...session, token }),
      },
    })

  return (
    <>
      <h2>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <h2>Token</h2>
      <pre>{JSON.stringify(token, null, 2)}</pre>
    </>
  )
}
