import { parse as parseCookie, serialize } from "cookie"
import type { RequestInternal, ResponseInternal } from "../index.js"
import { UnknownAction } from "./errors.js"
import type { AuthAction } from "./types.js"

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
// prettier-ignore
const actions: AuthAction[] = [ "providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "_log" ]

export async function toInternalRequest(
  req: Request
): Promise<RequestInternal | Error> {
  try {
    // TODO: url.toString() should not include action and providerId
    // see init.ts
    const url = new URL(req.url.replace(/\/$/, ""))
    const { pathname } = url

    const action = actions.find((a) => pathname.includes(a))
    if (!action) {
      throw new UnknownAction("Cannot detect action.")
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
      method: req.method ?? "GET",
      headers: Object.fromEntries(req.headers),
      body: req.body ? await getBody(req) : undefined,
      cookies: parseCookie(req.headers.get("cookie") ?? "") ?? {},
      error: url.searchParams.get("error") ?? undefined,
      query: Object.fromEntries(url.searchParams),
    }
  } catch (error) {
    return error
  }
}

export function toResponse(res: ResponseInternal): Response {
  const headers = new Headers(res.headers)

  res.cookies?.forEach((cookie) => {
    const { name, value, options } = cookie
    const cookieHeader = serialize(name, value, options)
    if (headers.has("Set-Cookie")) {
      headers.append("Set-Cookie", cookieHeader)
    } else {
      headers.set("Set-Cookie", cookieHeader)
    }
    // headers.set("Set-Cookie", cookieHeader) // TODO: Remove. Seems to be a bug with Headers in the runtime
  })

  const body =
    headers.get("content-type") === "application/json"
      ? JSON.stringify(res.body)
      : res.body

  const response = new Response(body, {
    headers,
    status: res.redirect ? 302 : res.status ?? 200,
  })

  if (res.redirect) {
    response.headers.set("Location", res.redirect.toString())
  }

  return response
}

/** Web compatible method to create a hash, using SHA256 */
export async function createHash(message) {
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
