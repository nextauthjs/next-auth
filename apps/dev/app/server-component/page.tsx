import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { unstable_getServerSession } from "next-auth/next"

type SessionWithToken = Session & { token: JWT }

export default async function Page() {
  const newLocal: Partial<
    import("/Users/sebastien/dev/next-auth/packages/next-auth/index").CallbacksOptions<
      Session,
      import("/Users/sebastien/dev/next-auth/packages/next-auth/index").Account,
      import("/Users/sebastien/dev/next-auth/packages/next-auth/index").DefaultSession
    >
  > = {
    session: ({ session, token }) => ({ ...session, token }),
  }
  const { token, ...session } = await unstable_getServerSession({
    providers: [],
    callbacks: newLocal,
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
