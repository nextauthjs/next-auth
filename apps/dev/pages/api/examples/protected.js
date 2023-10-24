// This is an example of to protect an API route
import { getServerSession } from "next-auth/next"
import { authOptions } from "/app/api/auth/[...nextauth]/route"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
      session,
    })
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    })
  }
}
