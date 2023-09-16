// This is an example of to protect an API route

import { auth } from "auth"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await auth(req, res)

  if (session) {
    return res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  }

  res.send({
    error: "You must be signed in to view the protected content on this page.",
  })
}
