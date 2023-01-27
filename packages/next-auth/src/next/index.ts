import { AuthHandler } from "../core"
import { getBody, getURL, setHeaders } from "../utils/node"

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { AuthOptions, Session } from ".."
import type {
  CallbacksOptions,
  NextAuthRequest,
  NextAuthResponse,
} from "../core/types"

async function NextAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthOptions
) {
  const headers = new Headers(req.headers as any)
  const url = getURL(req.url, headers)
  if (url instanceof Error) {
    if (process.env.NODE_ENV !== "production") throw url
    const errorLogger = options.logger?.error ?? console.error
    errorLogger("INVALID_URL", url)
    res.status(400)
    return res.json({
      message:
        "There is a problem with the server configuration. Check the server logs for more information.",
    })
  }

  const request = new Request(url, {
    headers,
    method: req.method,
    ...getBody(req),
  })

  options.secret ??= options.jwt?.secret ?? process.env.NEXTAUTH_SECRET
  options.trustHost ??= !!(
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )

  const response = await AuthHandler(request, options)
  res.status(response.status)
  setHeaders(response.headers, res)

  return res.send(await response.text())
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

let experimentalWarningShown = false
let experimentalRSCWarningShown = false

type GetServerSessionOptions = Partial<Omit<AuthOptions, "callbacks">> & {
  callbacks?: Omit<AuthOptions["callbacks"], "session"> & {
    session?: (...args: Parameters<CallbacksOptions["session"]>) => any
  }
}

export async function unstable_getServerSession<
  O extends GetServerSessionOptions,
  R = O["callbacks"] extends { session: (...args: any[]) => infer U }
    ? U
    : Session
>(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"], O]
    | [NextApiRequest, NextApiResponse, O]
    | [O]
    | []
): Promise<R | null> {
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

  const url = getURL("/api/auth/session", new Headers(req.headers))
  if (url instanceof Error) {
    if (process.env.NODE_ENV !== "production") throw url
    const errorLogger = options.logger?.error ?? console.error
    errorLogger("INVALID_URL", url)
    res.status(400)
    return res.json({
      message:
        "There is a problem with the server configuration. Check the server logs for more information.",
    })
  }

  const request = new Request(url, { headers: new Headers(req.headers) })

  options.secret ??= process.env.NEXTAUTH_SECRET
  options.trustHost = true
  const response = await AuthHandler(request, options)

  const { status = 200, headers } = response

  setHeaders(headers, res)

  // This would otherwise break rendering
  // with `getServerSideProps` that needs to always return HTML
  res.removeHeader?.("Content-Type")

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null

  if (status === 200) {
    if (isRSC) delete data.expires
    return data as R
  }
  throw new Error(data.message)
}
