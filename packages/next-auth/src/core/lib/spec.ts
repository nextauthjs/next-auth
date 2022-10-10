import { serialize, parse as parseCookie } from "cookie"
import { detectHost } from "../../utils/detect-host"
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
    body: req.body ? await readJSONBody(req.body) : undefined,
    cookies: cookies,
    providerId: nextauth[1],
    error: url.searchParams.get("error") ?? undefined,
    host: detectHost(headers["x-forwarded-host"] ?? headers.host),
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
