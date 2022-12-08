import type { IncomingMessage } from "http"
import type { GetServerSidePropsContext, NextApiRequest } from "next"

export function setCookie(res, value: string) {
  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader("Set-Cookie") ?? []
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader]
  }
  setCookieHeader.push(value)
  res.setHeader("Set-Cookie", setCookieHeader)
}

export function getBody(
  req: IncomingMessage | NextApiRequest | GetServerSidePropsContext["req"]
) {
  if (!("body" in req) || !req.body || req.method !== "POST") {
    return
  }

  if (req.body instanceof ReadableStream) {
    return { body: req.body }
  }

  if (req.headers["content-type"] === "application/x-www-form-urlencoded") {
    return { body: new URLSearchParams(req.body) }
  }

  return { body: JSON.stringify(req.body) }
}

/** Extract the host from the environment */
export function getURL(
  url: string | undefined | null,
  trusted: boolean | undefined = !!(
    process.env.AUTH_TRUST_HOST ?? process.env.VERCEL
  ),
  forwardedValue: string | string[] | undefined | null
): URL | Error {
  try {
    let host =
      process.env.NEXTAUTH_URL ??
      (process.env.NODE_ENV !== "production" && "http://localhost:3000")

    if (trusted && forwardedValue) {
      host = Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue
    }

    if (!host) throw new TypeError("Invalid host")
    if (!url) throw new TypeError("Invalid URL, cannot determine action")

    if (host.startsWith("http://") || host.startsWith("https://")) {
      return new URL(`${host}${url}`)
    }
    return new URL(`https://${host}${url}`)
  } catch (error) {
    return error as Error
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_TRUST_HOST?: string
      NEXTAUTH_URL?: string
      NEXTAUTH_SECRET?: string
      VERCEL?: "1"
    }
  }
}
