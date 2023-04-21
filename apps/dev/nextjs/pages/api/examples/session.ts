import { authConfig } from "../auth-old/[...nextauth]"
// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth/next"

export default async (req, res) => {
  const session = await getServerSession(req, res, authConfig as any)
  res.json(session)
}
