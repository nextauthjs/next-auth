import { serialize, parse as parseCookie } from "cookie"
import { detectHost } from "../../utils/detect-host"
import type { InternalResponse, InternalRequest } from ".."
import type { NextAuthAction } from "../types"

// TODO: Implement
async function readBody(
  body: ReadableStream | null
): Promise<Record<string, any> | undefined> {
  throw new Error("Not implemented")
}

// TODO:
export async function fromRequest(req: Request): Promise<InternalRequest> {
  // TODO: handle custom url
  const url = new URL(req.url, "http://localhost:3000")
  const nextauth = url.pathname.split("/").slice(3)
  const headers = Object.fromEntries(req.headers.entries())
  const query: Record<string, any> = Object.fromEntries(
    url.searchParams.entries()
  )
  query.nextauth = nextauth

  const cookieHeader = req.headers.get("cookie") ?? ""
  const cookies =
    parseCookie(
      Array.isArray(cookieHeader) ? cookieHeader.join(";") : cookieHeader
    ) ?? {}

  return {
    action: nextauth[0] as NextAuthAction,
    method: req.method,
    headers,
    body: await readBody(req.body),
    cookies: cookies,
    providerId: nextauth[1],
    error: url.searchParams.get("error") ?? undefined,
    host: detectHost(headers["x-forwarded-host"] ?? headers.host),
    query,
  }
}

export function toResponse(res: InternalResponse): Response {
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
    res.headers?.find(({ key }) => key === "Content-Type")?.value ===
    "application/json"
      ? JSON.stringify(res.body)
      : res.body

  const response = new Response(body, {
    headers,
    status: res.redirect ? 301 : res.status ?? 200,
  })

  if (res.redirect) {
    response.headers.set("Location", res.redirect)
  }

  return response
}
