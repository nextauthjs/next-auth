import { serialize } from "cookie"
import { Cookie } from "../core/lib/cookie"

export function setCookie(res, cookie: Cookie) {
  const { name, value, options } = cookie
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value)

  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + (options.maxAge ?? 0))
    options.maxAge = (options.maxAge ?? 0) / 1000
  }

  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader("Set-Cookie") ?? []
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader]
  }
  const cookieHeader = serialize(name, String(stringValue), options)
  setCookieHeader.push(cookieHeader)
  res.setHeader("Set-Cookie", setCookieHeader)
}
