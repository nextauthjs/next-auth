import { cache } from "@solidjs/router"
import { auth } from "../../../auth"

export const getSession = cache(async () => {
  "use server"

  const session = await auth()
  console.log("GETSESSION.SESSION", session)
  return session
}, "session")
