// This is an example of how to access a session from an API route
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  res.send(JSON.stringify(session, null, 2))
}
