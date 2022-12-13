import type { Handle } from "@sveltejs/kit"
import { _authOptions } from "./routes/api/auth/[...auth]/+server"
import { getServerSession } from 'next-auth-sveltekit'

export const handle: Handle = async function handle({
  event,
  resolve,
}): Promise<Response> {
  event.locals.session = await getServerSession(event.request, _authOptions) as App.Session

  return resolve(event)
}
