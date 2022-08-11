import { NextAuthHandler } from "../core"
import { detectHost } from "../utils/detect-host"
import { setCookie } from "./utils"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions, Session } from ".."
import type { NextAuthRequest, NextAuthResponse } from "../core/types"

async function NextAuthNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  options.secret =
    options.secret ?? options.jwt?.secret ?? process.env.NEXTAUTH_SECRET

  const shouldUseBody =
    req.method !== "GET" && req.headers["content-type"] === "application/json"

  const _req = new Request(req.url!, {
    headers: new Headers(req.headers as any),
    method: req.method,
    ...((shouldUseBody
      ? { body: JSON.stringify(Object.fromEntries(Object.entries(req.body))) }
      : {}) as any),
  })

  const _res = await NextAuthHandler(_req, options)

  res.status(_res.status ?? 200)

  for (const [key, value] of _res.headers.entries()) {
    res.setHeader(key, value)
  }

  // If the request expects a return URL, send it as JSON
  // instead of doing an actual redirect.
  const redirect = _res.headers.get("Location")
  if (req.body?.json === "true" && redirect) {
    return res.json({ url: redirect })
  }

  return res.send(_res.body)
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
      await NextAuthNextHandler(req, res, args[0])
  }

  return NextAuthNextHandler(args[0], args[1], args[2])
}

export default NextAuth

let experimentalWarningShown = false
export async function unstable_getServerSession(
  ...args:
    | [
        GetServerSidePropsContext["req"],
        GetServerSidePropsContext["res"],
        NextAuthOptions
      ]
    | [NextApiRequest, NextApiResponse, NextAuthOptions]
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

  const [req, res, options] = args

  options.secret = options.secret ?? process.env.NEXTAUTH_SECRET

  const session = await NextAuthHandler<Session | {}>({
    options,
    req: {
      host: detectHost(req.headers["x-forwarded-host"]),
      action: "session",
      method: "GET",
      cookies: req.cookies,
      headers: req.headers,
    },
  })

  const { body, cookies } = session

  cookies?.forEach((cookie) => setCookie(res, cookie))

  if (body && Object.keys(body).length) return body as Session
  return null
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL?: string
      VERCEL?: "1"
    }
  }
}
