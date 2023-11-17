import { parse as parseCookie, serialize } from "cookie"
import { UnknownAction } from "../../errors.js"

import type {
  AuthAction,
  RequestInternal,
  ResponseInternal,
} from "../../types.js"

async function getBody(req: Request): Promise<Record<string, any> | undefined> {
  if (!("body" in req) || !req.body || req.method !== "POST") return

  const contentType = req.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await req.json()
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(await req.text())
    return Object.fromEntries(params)
  }
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

export async function toInternalRequest(
  req: Request
): Promise<RequestInternal | Error> {
  try {
    let originalUrl = new URL(req.url.replace(/\/$/, ""))
    let url = new URL(originalUrl)
    const pathname = url.pathname.replace(/\/$/, "")

    const action = actions.find((a) => pathname.includes(a))
    if (!action) {
      throw new UnknownAction(`Cannot detect action in pathname (${pathname}).`)
    }

    // Remove anything after the basepath
    const re = new RegExp(`/${action}.*`)
    url = new URL(url.href.replace(re, ""))

    if (req.method !== "GET" && req.method !== "POST") {
      throw new UnknownAction("Only GET and POST requests are supported.")
    }

    const providerIdOrAction = pathname.split("/").pop()
    let providerId
    if (
      providerIdOrAction &&
      !action.includes(providerIdOrAction) &&
      ["signin", "callback"].includes(action)
    ) {
      providerId = providerIdOrAction
    }

    return {
      url,
      action,
      providerId,
      method: req.method,
      headers: Object.fromEntries(req.headers),
      body: req.body ? await getBody(req) : undefined,
      cookies: parseCookie(req.headers.get("cookie") ?? "") ?? {},
      error: originalUrl.searchParams.get("error") ?? undefined,
      query: Object.fromEntries(originalUrl.searchParams),
    }
  } catch (e) {
    return e as Error
  }
}

export function toRequest(request: RequestInternal): Request {
  return new Request(request.url, {
    headers: request.headers,
    method: request.method,
    body:
      request.method === "POST"
        ? JSON.stringify(request.body ?? {})
        : undefined,
  })
}

export function toResponse(res: ResponseInternal): Response {
  const headers = new Headers(res.headers)

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

/** Web compatible method to create a hash, using SHA256 */
export async function createHash(message: string) {
  const data = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toString()
}

/** Web compatible method to create a random string of a given length */
export function randomString(size: number) {
  const i2hex = (i: number) => ("0" + i.toString(16)).slice(-2)
  const r = (a: string, i: number): string => a + i2hex(i)
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  return Array.from(bytes).reduce(r, "")
}
