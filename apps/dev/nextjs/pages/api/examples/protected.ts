import type { NextApiHandler } from "next"

import { getServerSession } from "../../../auth"

export default async function handler(...args: Parameters<NextApiHandler>) {
  const session = await getServerSession(...args)
  const res = args[1]
  if (session) {
    // Do something with the session
    return res.send("This is protected content.")
  }
  res.status(401).send("You must be signed in.")
}
