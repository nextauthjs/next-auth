import { AuthHandler } from "../core"
import { detectHost } from "../utils/detect-host"
import { setCookie } from "./utils"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { AuthOptions, Session } from ".."
import type {
  CallbacksOptions,
  AuthAction,
  NextAuthRequest,
  NextAuthResponse,
} from "../core/types"

async function NextAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthOptions
) {
  const { nextauth, ...query } = req.query

  options.secret =
    options.secret ?? options.jwt?.secret ?? process.env.NEXTAUTH_SECRET

  const handler = await AuthHandler({
    req: {
      host: detectHost(req.headers["x-forwarded-host"]),
      body: req.body,
      query,
      cookies: req.cookies,
      headers: req.headers,
      method: req.method,
      action: nextauth?.[0] as AuthAction,
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

function NextAuth(options: AuthOptions): any
function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthOptions
): any

/** The main entry point to next-auth */
function NextAuth(
  ...args: [AuthOptions] | [NextApiRequest, NextApiResponse, AuthOptions]
) {
  if (args.length === 1) {
    return async (req: NextAuthRequest, res: NextAuthResponse) =>
      await NextAuthHandler(req, res, args[0])
  }

  return NextAuthHandler(args[0], args[1], args[2])
}

export default NextAuth

let experimentalRSCWarningShown = false

type GetServerSessionOptions = Partial<Omit<AuthOptions, "callbacks">> & {
  callbacks?: Omit<AuthOptions["callbacks"], "session"> & {
    session?: (...args: Parameters<CallbacksOptions["session"]>) => any
  }
}

type GetServerSessionParams<O extends GetServerSessionOptions> =
  | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"], O]
  | [NextApiRequest, NextApiResponse, O]
  | [O]
  | []

export async function getServerSession<
  O extends GetServerSessionOptions,
  R = O["callbacks"] extends { session: (...args: any[]) => infer U }
    ? U
    : Session
>(...args: GetServerSessionParams<O>): Promise<R | null> {
  const isRSC = args.length === 0 || args.length === 1
  if (
    !experimentalRSCWarningShown &&
    isRSC &&
    process.env.NODE_ENV !== "production"
  ) {
    console.warn(
      "[next-auth][warn][EXPERIMENTAL_API]",
      "\n`getServerSession` is used in a React Server Component.",
      `\nhttps://next-auth.js.org/configuration/nextjs#getServerSession}`,
      `\nhttps://next-auth.js.org/warnings#EXPERIMENTAL_API`
    )
    experimentalRSCWarningShown = true
  }

  let req, res, options: AuthOptions
  if (isRSC) {
    options = Object.assign({}, args[0], { providers: [] })

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
    options = Object.assign({}, args[2], { providers: [] })
  }

  options.secret = options.secret ?? process.env.NEXTAUTH_SECRET

  const session = await AuthHandler<Session | {} | string>({
    options,
    req: {
      host: detectHost(req.headers["x-forwarded-host"]),
      action: "session",
      method: "GET",
      cookies: req.cookies,
      headers: req.headers,
    },
  })

  const { body, cookies, status = 200 } = session

  cookies?.forEach((cookie) => setCookie(res, cookie))

  if (body && typeof body !== "string" && Object.keys(body).length) {
    if (status === 200) {
      // @ts-expect-error
      if (isRSC) delete body.expires
      return body as R
    }
    throw new Error((body as any).message)
  }

  return null
}

let deprecatedWarningShown = false

/** @deprecated renamed to `getServerSession` */
export async function unstable_getServerSession<
  O extends GetServerSessionOptions,
  R = O["callbacks"] extends { session: (...args: any[]) => infer U }
    ? U
    : Session
>(...args: GetServerSessionParams<O>): Promise<R | null> {
  if (!deprecatedWarningShown && process.env.NODE_ENV !== "production") {
    console.warn(
      "`unstable_getServerSession` has been renamed to `getServerSession`."
    )
    deprecatedWarningShown = true
  }

  return await getServerSession(...args)
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
