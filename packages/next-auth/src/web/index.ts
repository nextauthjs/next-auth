import { AuthHandler } from "../core"

import type { AuthOptions } from ".."
export * from "../core/types"

async function WebAuthHandler(req: Request, options: AuthOptions) {
  options.secret ??= options.jwt?.secret ?? process.env.NEXTAUTH_SECRET
  options.__internal__ = { runtime: "web" }

  const url = new URL(req.url ?? "")

  const res = await AuthHandler(new Request(url, req), options)

  // If the request expects a return URL, send it as JSON
  // instead of doing an actual redirect.
  const redirect = res.headers.get("Location")
  if (req.headers.get("X-Auth-Return-Redirect") && redirect) {
    res.headers.delete("Location")
    return new Response(JSON.stringify({ url: redirect }), res)
  }

  return res
}

function Auth(options: AuthOptions): any
function Auth(req: Request, options: AuthOptions): any

/** The main entry point to next-auth/web */
function Auth(...args: [AuthOptions] | [Request, AuthOptions]) {
  if (!args.length || args[0] instanceof Request) {
    // @ts-expect-error
    return WebAuthHandler(...args)
  }
  if (args.length === 1)
    return async (req: Request) => await WebAuthHandler(req, args[0])

  return WebAuthHandler(args[0], args[1])
}

export default Auth
