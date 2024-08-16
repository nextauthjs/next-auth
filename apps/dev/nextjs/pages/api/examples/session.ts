// This is an example of how to access a session from an API route
import { auth } from "auth"

export default async (req, res) => {
  const session = await auth(req, res)
  res.json(session)
}
