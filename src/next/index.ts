import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { NextAuthOptions, Session } from ".."
import { NextAuthHandler } from "../core"
import { NextAuthAction, NextAuthRequest, NextAuthResponse } from "../lib/types"
import { set as setCookie } from "../core/lib/cookie"
import logger, { setLogger } from "../lib/logger"

async function NextAuthNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  setLogger(options.logger)

  if (!req.query.nextauth) {
    const error = new Error(
      "Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly."
    )

    logger.error("MISSING_NEXTAUTH_API_ROUTE_ERROR", error)
    return res.status(500).send(error.message)
  }

  const host = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL
  if (!host) logger.warn("NEXTAUTH_URL")

  const {
    body,
    redirect,
    cookies,
    headers,
    status = 200,
  } = await NextAuthHandler({
    req: {
      host,
      body: req.body,
      query: req.query,
      cookies: req.cookies,
      headers: req.headers,
      method: req.method ?? "GET",
      action: req.query.nextauth[0] as NextAuthAction,
      providerId: req.query.nextauth[1],
      error: (req.query.error as string | undefined) ?? req.query.nextauth[1],
    },
    options,
  })

  res.status(status)

  cookies?.forEach((cookie) => {
    setCookie(res, cookie.name, cookie.value, cookie.options)
  })
  headers?.forEach((header) => {
    res.setHeader(header.key, header.value)
  })

  if (redirect) {
    // If the request expects a return URL, send it as JSON
    // instead of doing an actual redirect.
    if (req.body?.json !== "true") {
      // Could chain. .end() when lowest target is Node 14
      // https://github.com/nodejs/node/issues/33148
      res.status(302).setHeader("Location", redirect)
      return res.end()
    }
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
      action: "session",
      method: "GET",
      cookies: context.req.cookies,
      headers: context.req.headers,
    },
  })

  const { body, cookies } = session

  cookies?.forEach((cookie) => {
    setCookie(context.res, cookie.name, cookie.value, cookie.options)
  })

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
