import { Auth, SessionRequest } from "@auth/core"
import { authConfig } from "../auth/[...nextauth]"

export default async function handle(req: Request) {
  authConfig.secret = process.env.AUTH_SECRET

  const response = await Auth(new SessionRequest(req), authConfig)
  const session = await response.session()
  if (!session) {
    return new Response("Not authenticated", { status: 401 })
  }

  console.log(session.user) // Do something with the session
  // Pass the original headers to set cookies (eg.: updating the session expiry)
  response.headers.set("content-type", "text/plain")
  return new Response("Authenticated", { headers: response.headers })
}

export const config = {
  runtime: "experimental-edge",
}
