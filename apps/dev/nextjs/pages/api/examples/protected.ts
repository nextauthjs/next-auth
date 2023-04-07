// This is an example of to protect an API route
import { authConfig } from "app/api/auth/[...nextauth]/route"
import { unstable_getServerSession } from "next-auth/next"

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authConfig)

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
