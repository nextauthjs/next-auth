import type { Handle } from "@sveltejs/kit"
import { getServerSession, options as nextAuthOptions } from "$lib/next-auth"

export const handle: Handle = async function handle({
  event,
  resolve,
}): Promise<Response> {
  const session = await getServerSession(event.request, nextAuthOptions)
  if (session) {
    event.locals.session = session
  }

  return resolve(event)
}
