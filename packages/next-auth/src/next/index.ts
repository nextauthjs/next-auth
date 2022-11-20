import { AuthHandler } from "../core"
import { getURL, getBody } from "../utils/node"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions, Session } from ".."
import type { NextAuthRequest, NextAuthResponse } from "../core/types"

async function NextAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  const url = getURL(
    req.url,
    options.trustHost,
    req.headers["x-forwarded-host"] ?? req.headers.host
  )

  if (url instanceof Error) return res.status(400).end()

  const request = new Request(url, {
    headers: new Headers(req.headers as any),
    method: req.method,
    ...getBody(req),
  })

  options.secret ??= options.jwt?.secret ?? process.env.NEXTAUTH_SECRET
  const { status, headers, body } = await AuthHandler(request, options)

  res.status(status)

  for (const [key, val] of headers.entries()) {
    const value = key === "set-cookie" ? val.split(",") : val
    res.setHeader(key, value)
  }

  // If the request expects a return URL, send it as JSON
  // instead of doing an actual redirect.
  const redirect = headers.get("Location")

  if (req.body?.json === "true" && redirect) {
    res.removeHeader("Location")
    return res.json({ url: redirect })
  }

  return res.send(body)
}

function NextAuth(options: NextAuthOptions): any
function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
): any

/** The main entry point to next-auth */
function NextAuth(
  ...args:
    | [NextAuthOptions]
    | [NextApiRequest, NextApiResponse, NextAuthOptions]
) {
  if (args.length === 1) {
    return async (req: NextAuthRequest, res: NextAuthResponse) =>
      await NextAuthHandler(req, res, args[0])
  }

  return NextAuthHandler(args[0], args[1], args[2])
}

export default NextAuth

let experimentalWarningShown = false
let experimentalRSCWarningShown = false
export async function unstable_getServerSession(
  ...args:
    | [
        GetServerSidePropsContext["req"],
        GetServerSidePropsContext["res"],
        NextAuthOptions
      ]
    | [NextApiRequest, NextApiResponse, NextAuthOptions]
    | [NextAuthOptions]
    | []
): Promise<Session | null> {
  if (!experimentalWarningShown && process.env.NODE_ENV !== "production") {
    console.warn(
      "[next-auth][warn][EXPERIMENTAL_API]",
      "\n`unstable_getServerSession` is experimental and may be removed or changed in the future, as the name suggested.",
      `\nhttps://next-auth.js.org/configuration/nextjs#unstable_getServerSession}`,
      `\nhttps://next-auth.js.org/warnings#EXPERIMENTAL_API`
    )
    experimentalWarningShown = true
  }

  const isRSC = args.length === 0 || args.length === 1
  if (
    !experimentalRSCWarningShown &&
    isRSC &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn(
      "[next-auth][warn][EXPERIMENTAL_API]",
      "\n`unstable_getServerSession` is used in a React Server Component.",
      `\nhttps://next-auth.js.org/configuration/nextjs#unstable_getServerSession}`,
      `\nhttps://next-auth.js.org/warnings#EXPERIMENTAL_API`
    )
    experimentalRSCWarningShown = true
  }

  let req, res, options: NextAuthOptions
  if (isRSC) {
    options = args[0] ?? { providers: [] }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { headers, cookies } = require("next/headers")
    req = {
      headers: Object.fromEntries(headers() as Headers),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
    }
    res = { getHeader() {}, setCookie() {}, setHeader() {} }
  } else {
    req = args[0]
    res = args[1]
    options = args[2]
  }

  const urlOrError = getURL(
    "/api/auth/session",
    options.trustHost,
    req.headers["x-forwarded-host"] ?? req.headers.host
  )

  if (urlOrError instanceof Error) throw urlOrError

  options.secret ??= process.env.NEXTAUTH_SECRET
  const response = await AuthHandler(
    new Request(urlOrError, { headers: req.headers }),
    options
  )

  const { status = 200, headers } = response

  for (const [key, val] of headers.entries()) {
    const value = key === "set-cookie" ? val.split(",") : val
    res.setHeader(key, value)
  }

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null

  if (status === 200) {
    if (isRSC) delete data.expires
    return data as Session
  }
  throw new Error(data.message)
}
