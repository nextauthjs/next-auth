import { parse as parseCookie, serialize } from "cookie"
import { UnknownAction } from "../../errors.js"
import { logger } from "./logger.js"

import type {
  AuthAction,
  AuthConfig,
  RequestInternal,
  ResponseInternal,
} from "../../types.js"
import { isAuthAction } from "./actions.js"

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

export async function toInternalRequest(
  req: Request,
  config: AuthConfig
): Promise<RequestInternal | undefined> {
  try {
    if (req.method !== "GET" && req.method !== "POST")
      throw new UnknownAction("Only GET and POST requests are supported.")

    // Defaults are usually set in the `init` function, but this is needed below
    config.basePath ??= "/auth"

    const url = new URL(req.url)

    const { action, providerId } = parseActionAndProviderId(
      url.pathname,
      config.basePath
    )

    return {
      url,
      action,
      providerId,
      method: req.method,
      headers: Object.fromEntries(req.headers),
      body: req.body ? await getBody(req) : undefined,
      cookies: parseCookie(req.headers.get("cookie") ?? "") ?? {},
      error: url.searchParams.get("error") ?? undefined,
      query: Object.fromEntries(url.searchParams),
    }
  } catch (e) {
    logger.error(e as Error)
    logger.debug("request", req)
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

/** @internal Parse the action and provider id from a URL pathname. */
export function parseActionAndProviderId(
  pathname: string,
  base: string
): {
  action: AuthAction
  providerId?: string
} {
  const a = pathname.match(new RegExp(`^${base}(.+)`))

  if (a === null) throw new UnknownAction(`Cannot parse action at ${pathname}`)

  const [_, actionAndProviderId] = a

  const b = actionAndProviderId.replace(/^\//, "").split("/")

  if (b.length !== 1 && b.length !== 2)
    throw new UnknownAction(`Cannot parse action at ${pathname}`)

  const [action, providerId] = b

  if (!isAuthAction(action))
    throw new UnknownAction(`Cannot parse action at ${pathname}`)

  if (providerId && !["signin", "callback", "webauthn-options"].includes(action))
    throw new UnknownAction(`Cannot parse action at ${pathname}`)

  return { action, providerId }
}
