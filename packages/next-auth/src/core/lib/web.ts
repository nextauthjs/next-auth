import { serialize, parse as parseCookie } from "cookie"
import type { ResponseInternal, RequestInternal } from ".."
import type { AuthAction } from "../types"

export async function toInternalRequest(
  req: Request
): Promise<RequestInternal> {
  const url = new URL(req.url)
  const nextauth = url.pathname.split("/").slice(3)
  const headers = Object.fromEntries(req.headers.entries())
  const query: Record<string, any> = Object.fromEntries(
    url.searchParams.entries()
  )

  const cookieHeader = req.headers.get("cookie") ?? ""
  const cookies =
    parseCookie(
      Array.isArray(cookieHeader) ? cookieHeader.join(";") : cookieHeader
    ) ?? {}

  return {
    action: nextauth[0] as AuthAction,
    method: req.method,
    headers,
    body: await getBody(req),
    cookies: cookies,
    providerId: nextauth[1],
    error: url.searchParams.get("error") ?? undefined,
    host: new URL(req.url).origin,
    query,
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
    if (headers.has("Set-Cookie")) {
      headers.append("Set-Cookie", cookieHeader)
    } else {
      headers.set("Set-Cookie", cookieHeader)
    }
  })

  const body =
    headers.get("content-type") === "application/json"
      ? JSON.stringify(res.body)
      : res.body

  const response = new Response(body, {
    headers,
    status: res.redirect ? 301 : res.status ?? 200,
  })

  if (res.redirect) {
    response.headers.set("Location", res.redirect.toString())
  }

  return response
}

/** Web/Node.js compatible method to create a hash, using SHA256 */
export async function createHash(message) {
  if (crypto.createHash) {
    return crypto.createHash("sha256").update(message).digest("hex")
  }
  if (crypto.subtle) {
    const data = new TextEncoder().encode(message)
    const hash = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toString()
  }

  throw new TypeError("`crypto` module is missing method(s) to create hash")
}

/** Web/Node.js compatible method to create a random string of a given length */
export function randomString(size: number) {
  if (crypto.getRandomValues) {
    const i2hex = (i: number) => ("0" + i.toString(16)).slice(-2)
    const r = (a: string, i: number): string => a + i2hex(i)
    const bytes = crypto.getRandomValues(new Uint8Array(size))
    return Array.from(bytes).reduce(r, "")
  }
  if (crypto.randomBytes) {
    return crypto.randomBytes(size).toString("hex")
  }

  throw new TypeError(
    "`crypto` module is missing method(s) to create random bytes"
  )
}

/** Web/Node.js compatible method to create a random UUID */
export function randomUUID() {
  if (crypto.randomUUID) return crypto.randomUUID()
  else if (crypto.randomBytes) return crypto.randomBytes(32).toString("hex")
  throw new TypeError(
    "`crypto` module is missing method(s) to create random UUID"
  )
}

async function getBody(req: Request): Promise<Record<string, any> | undefined> {
  if (!("body" in req) || !req.body || req.method !== "POST") {
    return
  }

  const contentType = req.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return await req.json()
  } else if (contentType?.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(await req.text())
    return Object.fromEntries(params.entries())
  }
}
