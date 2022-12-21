import { serialize } from "cookie"
import { Cookie } from "../core/lib/cookie"

export function setCookie(res, cookie: Cookie) {
  // Preserve any existing cookies that have already been set in the same session
  let setCookieHeader = res.getHeader("Set-Cookie") ?? []
  // If not an array (i.e. a string with a single cookie) convert it into an array
  if (!Array.isArray(setCookieHeader)) {
    setCookieHeader = [setCookieHeader]
  }
  const { name, value, options } = cookie
  const cookieHeader = serialize(name, value, options)
  setCookieHeader.push(cookieHeader)
  res.setHeader("Set-Cookie", setCookieHeader)
}
