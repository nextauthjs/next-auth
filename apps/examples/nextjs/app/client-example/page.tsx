import { auth } from "auth"
import ClientExample from "@/components/client-example"
import { SessionProvider } from "next-auth/react"

export default async function ClientPage() {
  const session = await auth()
  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      picture: session.user.picture,
    } // filter out sensitive data
  }

  return (
    <SessionProvider session={session}>
      <ClientExample />
    </SessionProvider>
  )
}
