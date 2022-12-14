import { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL } from "$env/static/private"
import { dev } from "$app/environment"

import { AuthHandler, type AuthOptions, type AuthAction } from "@auth/core"
import type { Handle } from "@sveltejs/kit"

export async function getServerSession(
  req: Request,
  options: AuthOptions
): Promise<unknown> {
  options.secret ??= AUTH_SECRET
  options.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const response = await AuthHandler(
    new Request(url, { headers: req.headers }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null

  if (status === 200) {
    return data
  }
  throw new Error(data.message)
}

interface SvelteKitAuthOptions extends AuthOptions {
  /**
   * @default '/auth'
   */
  prefix?: string
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
  "_log",
]

/** The main entry point to @auth/sveltekit */
function SvelteKitAuth({ prefix = "/auth", ...options }: SvelteKitAuthOptions): Handle {
  options.secret ??= AUTH_SECRET
  options.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? dev)

  return (({ event, resolve }) => {
    const [action] = event.url.pathname.slice(prefix.length + 1).split("/")
    const isAuth = actions.includes(action as AuthAction)

    if (!event.locals.getSession)
      event.locals.getSession = async () =>
        getServerSession(event.request, options)

    if (!event.url.pathname.startsWith(prefix + "/") || !isAuth) {
      return resolve(event)
    }

    return AuthHandler(event.request, options)
  })
}

export default SvelteKitAuth
