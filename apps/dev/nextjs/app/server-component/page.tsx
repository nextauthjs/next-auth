import { unstable_getServerSession } from "next-auth/next"

export default async function Page() {
  const session = await unstable_getServerSession()
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
