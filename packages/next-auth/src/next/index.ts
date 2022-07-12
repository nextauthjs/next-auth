import { NextAuthHandler } from "../core"
import { detectHost } from "../utils/detect-host"
import { setCookie } from "./utils"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions, Session } from ".."
import type {
  NextAuthAction,
  NextAuthRequest,
  NextAuthResponse,
} from "../core/types"

async function NextAuthNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  const { nextauth, ...query } = req.query

  options.secret =
    options.secret ?? options.jwt?.secret ?? process.env.NEXTAUTH_SECRET

  const handler = await NextAuthHandler({
    req: {
      host: detectHost(req.headers["x-forwarded-host"]),
      body: req.body,
      query,
      cookies: req.cookies,
      headers: req.headers,
      method: req.method,
      action: nextauth?.[0] as NextAuthAction,
      providerId: nextauth?.[1],
      error: (req.query.error as string | undefined) ?? nextauth?.[1],
    },
    options,
  })

  res.status(handler.status ?? 200)

  handler.cookies?.forEach((cookie) => setCookie(res, cookie))

  handler.headers?.forEach((h) => res.setHeader(h.key, h.value))

  if (handler.redirect) {
    // If the request expects a return URL, send it as JSON
    // instead of doing an actual redirect.
    if (req.body?.json !== "true") {
      // Could chain. .end() when lowest target is Node 14
      // https://github.com/nodejs/node/issues/33148
      res.status(302).setHeader("Location", handler.redirect)
      return res.end()
    }
    return res.json({ url: handler.redirect })
  }

  return res.send(handler.body)
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
