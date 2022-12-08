import type { ServerLoadEvent } from "@sveltejs/kit"
import {
  AUTH_SECRET,
} from "$env/static/private"
import {
  AUTH_TRUST_HOST,
  VERCEL,
  PUBLIC_NEXTAUTH_URL,
} from "$env/static/public"
import { AuthHandler, type AuthOptions } from "next-auth-core"

function getURL(
  url: string | undefined | null,
  trusted: boolean | undefined = !!(
    AUTH_TRUST_HOST ?? VERCEL
  ),
  forwardedValue: string | string[] | undefined | null
): URL | Error {
  try {
    let host = PUBLIC_NEXTAUTH_URL

    if (trusted && forwardedValue) {
      host = Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue
    }

    if (!host) throw new TypeError("Invalid host")

    return new URL(url ?? "", new URL(host))
  } catch (error) {
    return error as Error
  }
}
export const getServerSession = async (
  req: Request,
  options: AuthOptions
): Promise<unknown> => {

  options.secret ??= AUTH_SECRET
  const urlOrError = getURL(
    "/api/auth/session",
    options.trustHost,
    req.headers.get("x-forwarded-host") ?? req.headers.get('host')
  )

  if (urlOrError instanceof Error) throw urlOrError
  const response = await AuthHandler(
    new Request(urlOrError, { headers: req.headers }),
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

const SKAuthHandler = async (
  { request }: ServerLoadEvent,
  options: AuthOptions
): Promise<Response> => {
  options.secret ??= AUTH_SECRET

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
// export * from './getServerSession.js'