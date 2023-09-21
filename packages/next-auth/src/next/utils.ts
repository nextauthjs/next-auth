import { serialize } from "cookie"
import { Cookie } from "../core/lib/cookie"
import { type ResponseInternal } from "../core"

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

export async function getBody(
  req: Request
): Promise<Record<string, any> | undefined> {
  if (!("body" in req) || !req.body || req.method !== "POST") return

  const contentType = req.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await req.json()
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(await req.text())
    return Object.fromEntries(params)
  }
}

export function toResponse(res: ResponseInternal): Response {
  const headers = new Headers(
    res.headers?.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {})
  )

  res.cookies?.forEach((cookie) => {
    const { name, value, options } = cookie
    const cookieHeader = serialize(name, value, options)
    if (headers.has("Set-Cookie")) headers.append("Set-Cookie", cookieHeader)
    else headers.set("Set-Cookie", cookieHeader)
  })

  let body = res.body

  if (headers.get("content-type") === "application/json")
    body = JSON.stringify(res.body)
  else if (headers.get("content-type") === "application/x-www-form-urlencoded")
    body = new URLSearchParams(res.body).toString()

  const status = res.redirect ? 302 : res.status ?? 200
  const response = new Response(body, { headers, status })

  if (res.redirect) response.headers.set("Location", res.redirect)

  return response
}
