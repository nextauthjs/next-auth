import type { ServerLoadEvent } from "@sveltejs/kit"
import {
  AUTH_SECRET,
} from "$env/static/private"
import { AuthHandler, type AuthOptions } from "next-auth-core"


const SKAuthHandler = async (
  { request }: ServerLoadEvent,
  options: AuthOptions
): Promise<Response> => {
  options.secret = AUTH_SECRET

  console.log("SKAuthHandler", request, options)
  // TODO Glue handling of cookies and headers etc.
  return await AuthHandler(request, options)
}

/** The main entry point to next-auth-sveltekit */
function SvelteKitAuth(
  ...args: [AuthOptions]
): {
  GET: (event: ServerLoadEvent) => Promise<unknown>
  POST: (event: ServerLoadEvent) => Promise<unknown>
} {
  const options = args[0]
  return {
    GET: async (event) => await SKAuthHandler(event, options),
    POST: async (event) => await SKAuthHandler(event, options),
  }
}

export default SvelteKitAuth
