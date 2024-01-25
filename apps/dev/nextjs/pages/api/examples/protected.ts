import type { NextApiHandler } from "next"

import { auth } from "../../../auth"

export default async function handler(...args: Parameters<NextApiHandler>) {
  const session = await auth(...args)
  const res = args[1]
  if (session?.user) {
    // Do something with the session
    return res.json("This is protected content.")
  }
  res.status(401).json("You must be signed in.")
}
