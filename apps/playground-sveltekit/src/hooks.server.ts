import type { Handle } from "@sveltejs/kit"
import { authOptions } from "./routes/api/auth/[...nextauth]/+server"
import { getServerSession } from 'next-auth-sveltekit'

export const handle: Handle = async function handle({
  event,
  resolve,
}): Promise<Response> {
  const session = await getServerSession(event.request, authOptions)
  if (session) {
    event.locals.session = session
  }

  return resolve(event)
}
