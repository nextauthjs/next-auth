import { unstable_getServerSession } from "next-auth/next"

export default async function Page() {
  const { token, ...session } = await unstable_getServerSession({
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
