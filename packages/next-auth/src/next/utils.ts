import type { GetServerSidePropsContext, NextApiRequest } from "next"
import type { NextRequest } from "next/server"

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
  req: NextApiRequest | NextRequest | GetServerSidePropsContext["req"]
) {
  if (!("body" in req) || !req.body || req.method !== "POST") {
    return
  }

  if (req.body instanceof ReadableStream) {
    return { body: req.body }
  }
  return { body: JSON.stringify(req.body) }
}
