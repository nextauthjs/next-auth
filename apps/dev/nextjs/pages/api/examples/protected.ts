// This is an example of to protect an API route
import { auth } from "auth"
import { NextApiRequest, NextApiResponse } from "next"

// @ts-expect-error
export default auth((req: NextApiRequest, res: NextApiResponse) => {
  // @ts-expect-error
  const session = req.auth

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
})
