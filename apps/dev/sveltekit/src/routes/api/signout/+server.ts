import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
  const res = await event.locals.signOut({ redirectTo: '/' })

  return res
}