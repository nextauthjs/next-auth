import type { IncomingMessage, ServerResponse } from "http"
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
  return { body: JSON.stringify(req.body) }
}

/**
 * Extract the full request URL from the environment.
 * NOTE: It does not verify if the host should be trusted.
 */
export function getURL(url: string | undefined, headers: Headers): URL | Error {
  try {
    if (!url) throw new Error("Missing url")
    if (process.env.NEXTAUTH_URL) {
      const base = new URL(process.env.NEXTAUTH_URL)
      if (!["http:", "https:"].includes(base.protocol)) {
        throw new Error("Invalid protocol")
      }
      const hasCustomPath = base.pathname !== "/"

      if (hasCustomPath) {
        const apiAuthRe = /\/api\/auth\/?$/
        const basePathname = base.pathname.match(apiAuthRe)
          ? base.pathname.replace(apiAuthRe, "")
          : base.pathname
        return new URL(basePathname.replace(/\/$/, "") + url, base.origin)
      }
      return new URL(url, base)
    }
    const proto =
      headers.get("x-forwarded-proto") ??
      (process.env.NODE_ENV !== "production" ? "http" : "https")
    const host = headers.get("x-forwarded-host") ?? headers.get("host")
    if (!["http", "https"].includes(proto)) throw new Error("Invalid protocol")
    const origin = `${proto}://${host}`
    if (!host) throw new Error("Missing host")
    return new URL(url, origin)
  } catch (error) {
    return error as Error
  }
}

/**
 * Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
 * that are within a single set-cookie field-value, such as in the Expires portion.
 * This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
 * Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
 * Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
 * Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
 * @source https://github.com/nfriedly/set-cookie-parser/blob/3eab8b7d5d12c8ed87832532861c1a35520cf5b3/lib/set-cookie.js#L144
 */
function getSetCookies(cookiesString: string) {
  if (typeof cookiesString !== "string") {
    return []
  }

  const cookiesStrings: string[] = []
  let pos = 0
  let start
  let ch
  let lastComma: number
  let nextStart
  let cookiesSeparatorFound

  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1
    }
    return pos < cookiesString.length
  }

  function notSpecialChar() {
    ch = cookiesString.charAt(pos)

    return ch !== "=" && ch !== ";" && ch !== ","
  }

  while (pos < cookiesString.length) {
    start = pos
    cookiesSeparatorFound = false

    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos)
      if (ch === ",") {
        // ',' is a cookie separator if we have later first '=', not ';' or ','
        lastComma = pos
        pos += 1

        skipWhitespace()
        nextStart = pos

        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1
        }

        // currently special character
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          // we found cookies separator
          cookiesSeparatorFound = true
          // pos is inside the next cookie, so back up and return it.
          pos = nextStart
          cookiesStrings.push(cookiesString.substring(start, lastComma))
          start = pos
        } else {
          // in param ',' or param separator ';',
          // we continue from that comma
          pos = lastComma + 1
        }
      } else {
        pos += 1
      }
    }

    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length))
    }
  }

  return cookiesStrings
}

export function setHeaders(headers: Headers, res: ServerResponse) {
  for (const [key, val] of headers.entries()) {
    let value: string | string[] = val
    // See: https://github.com/whatwg/fetch/issues/973
    if (key === "set-cookie") {
      const cookies = getSetCookies(value)
      let original = res.getHeader("set-cookie") as string[] | string
      original = Array.isArray(original) ? original : [original]
      value = original.concat(cookies).filter(Boolean)
    }
    res.setHeader(key, value)
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
