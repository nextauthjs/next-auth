import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { NextAuthOptions, Session } from ".."
import { IncomingRequest, NextAuthHandler } from "../server/handler"
import extendRes from "../server/lib/extend-res"
import { set as setCookie } from "../server/lib/cookie"
import logger, { setLogger } from "../lib/logger"

async function NextAuthNextHandler(req, res, options) {
  extendRes(req, res)

  const {
    nextauth,
    action = nextauth[0],
    providerId = nextauth[1],
    error = nextauth[1],
  } = req.query

  if (options.logger) {
    setLogger(options.logger)
  }

  if (!req.query.nextauth) {
    const message =
      "Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly."

    logger.error("MISSING_NEXTAUTH_API_ROUTE_ERROR", new Error(message))
    return {
      status: 500,
      text: `Error: ${message}`,
    }
  }

  const request: IncomingRequest = {
    body: req.body,
    query: req.query,
    cookies: req.cookies,
    headers: req.headers,
    method: req.method,
    action,
    providerId,
    error,
  }
  const {
    json,
    redirect,
    text,
    cookies,
    headers,
    status = 200,
  } = await NextAuthHandler({ req: request, options })

  res.status(status)

  cookies?.forEach((cookie) => {
    setCookie(res, cookie.name, cookie.value, cookie.options)
  })
  headers?.forEach((header) => {
    res.setHeader(header.key, header.value)
  })

  if (redirect) {
    return res.redirect(redirect)
  } else if (json) {
    return res.json(json)
  } else if (text) {
    return res.send(text)
  }
  return res
    .status(400)
    .send(`Error: HTTP ${req.method} is not supported for ${req.url}`)
}

function NextAuth(options: NextAuthOptions): any
function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
): any

/** Tha main entry point to next-auth */
function NextAuth(...args) {
  if (args.length === 1) {
    return async (req, res) => await NextAuthNextHandler(req, res, args[0])
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
  const session = await NextAuthHandler<Session>({
    options,
    req: {
      action: "session",
      method: "GET",
      cookies: context.req.cookies,
      headers: context.req.headers,
    },
  })

  const { json, cookies } = session

  cookies?.forEach((cookie) => {
    setCookie(context.res, cookie.name, cookie.value, cookie.options)
  })

  if (!json) return null
  return Object.keys(json) ? json : null
}
