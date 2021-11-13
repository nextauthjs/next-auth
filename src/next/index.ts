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
import { NoAPIRouteError, NoSecretError } from "./errors"

/**
 * Verify that the user configured `next-auth` correctly.
 * Good place to mention deprecations as well.
 */
function assertConfig(options: {
  query?: NextApiRequest["query"]
  secret?: string
  host?: string
}) {
  if (!options.query?.nextauth) {
    return new NoAPIRouteError(
      "Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly."
    )
  }

  if (!options.secret) {
    if (process.env.NODE_ENV === "production") {
      return new NoSecretError("Please define a `secret` in production.")
    } else {
      logger.warn("NO_SECRET")
    }
  }

  if (!options.host) logger.warn("NEXTAUTH_URL")
}

async function NextAuthNextHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  setLogger(options.logger, options.debug)

  const host = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL

  const error = assertConfig({ query: req.query, secret: options.secret, host })

  if (error) {
    logger.error(error.code, error)
    return res.status(500).send(error.message)
  }

  const handler = await NextAuthHandler({
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

  res.status(handler.status ?? 200)

  handler.cookies?.forEach((c) => setCookie(res, c.name, c.value, c.options))

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

  cookies?.forEach((c) => setCookie(context.res, c.name, c.value, c.options))

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
