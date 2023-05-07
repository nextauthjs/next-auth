// This is an example of how to access a session from an API route
import { auth } from "auth"

export default auth((req, res) => {
  const session = req.auth
  res.json(session)
})
