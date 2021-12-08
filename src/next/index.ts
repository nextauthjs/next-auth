import { NextAuthHandler } from "../core"
import { setCookie } from "./cookie"

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
} from "../lib/types"

async function NextAuthNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  const { nextauth, ...query } = req.query
  const handler = await NextAuthHandler({
    req: {
      host:
        process.env.NEXTAUTH_URL ??
        process.env.VERCEL_URL ??
        "http://localhost:3000",
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

/** Tha main entry point to next-auth */
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

export async function getServerSession(
  context:
    | GetServerSidePropsContext
    | { req: NextApiRequest; res: NextApiResponse },
  options: NextAuthOptions
): Promise<Session | null> {
  const session = await NextAuthHandler<Session | {}>({
    options,
    req: {
      host: (process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL) as string,
      action: "session",
      method: "GET",
      cookies: context.req.cookies,
      headers: context.req.headers,
    },
  })

  const { body, cookies } = session

  cookies?.forEach((cookie) => setCookie(context.res, cookie))

  if (body && Object.keys(body).length) return body as Session
  return null
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL?: string
      VERCEL_URL?: string
    }
  }
}
