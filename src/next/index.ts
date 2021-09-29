import { NextApiRequest, NextApiResponse } from "next"
import { NextAuthOptions } from ".."
import { IncomingRequest, NextAuthHandler } from "../server"
import extendRes from "../server/lib/extend-res"
import { set as setCookie } from "../server/lib/cookie"

async function NextAuthNextHandler(req, res, userOptions) {
  extendRes(req, res)

  const request: IncomingRequest = {
    body: req.body,
    query: req.query,
    cookies: req.cookies,
    headers: req.headers,
    method: req.method,
  }
  const {
    json,
    redirect,
    text,
    cookies,
    headers,
    status = 200,
  } = await NextAuthHandler({ ...request, userOptions })

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
