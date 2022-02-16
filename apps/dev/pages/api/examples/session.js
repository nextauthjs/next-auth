// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth/react"

export default async (req, res) => {
  const session = await getServerSession({ req })
  res.send(JSON.stringify(session, null, 2))
}
