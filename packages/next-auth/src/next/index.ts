import { serialize } from "cookie"
import { AuthHandler, AuthHandlerInternal } from "../core"
import { detectHost } from "../utils/detect-host"
import { setCookie, getBody } from "./utils"

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
  options.secret ??= options.jwt?.secret ?? process.env.NEXTAUTH_SECRET

  // TODO: verify (detect host), normalize (full url), fallback (localhost)
  const url = new URL(req.url ?? "", "http://localhost:3000")

  const { status, headers, body } = await AuthHandler(
    new Request(url, {
      headers: new Headers(req.headers as any),
      method: req.method,
      ...getBody(req),
    }),
    options
  )

  res.status(status)

  for (const [key, value] of headers.entries()) {
    if (key === "set-cookie") {
      res.setHeader("set-cookie", value.split(","))
    } else {
      res.setHeader(key, value)
    }
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

  const session = await AuthHandlerInternal<Session | {}>({
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

  cookies?.forEach((cookie) => {
    const { name, value, options } = cookie
    const cookieHeader = serialize(name, value, options)
    setCookie(res, cookieHeader)
  })

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
