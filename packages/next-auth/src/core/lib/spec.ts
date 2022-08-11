import { serialize, parse as parseCookie } from "cookie"
import { detectHost } from "../../utils/detect-host"
import type { InternalResponse, InternalRequest } from ".."
import type { NextAuthAction } from "../types"

async function readBody(
  body: ReadableStream | null
): Promise<Record<string, any> | undefined> {
  try {
    const reader = body?.getReader()

    if (!reader) return undefined

    const chunks: Uint8Array[] = []
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      chunks.push(value)
    }

    return JSON.parse(Buffer.concat(chunks).toString())
  } catch {}
}

// TODO:
): Promise<InternalRequest> {
  // TODO: handle custom url
  const url = new URL(req.url, "http://localhost:3000")
  const nextauth = url.pathname.split("/").slice(3)
  const headers = Object.fromEntries(req.headers.entries())
  const query: Record<string, any> = Object.fromEntries(
    url.searchParams.entries()
  )
  query.nextauth = nextauth

  const cookieHeader = req.headers.get("cookie")
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
    _res.headers?.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {})
  )

  _res.cookies?.forEach((cookie) => {
    const { name, value, options } = cookie
    const cookieHeader = serialize(name, value, options)
    if (headers.has("Set-Cookie")) {
      headers.append("Set-Cookie", cookieHeader)
    } else {
      headers.set("Set-Cookie", cookieHeader)
    }
  })

  const body =
    _res.headers?.find(({ key }) => key === "Content-Type")?.value ===
    "application/json"
      ? JSON.stringify(_res.body)
      : _res.body

  const response = new Response(body, {
    headers,
    status: _res.redirect ? 301 : _res.status ?? 200,
  })

  if (_res.redirect) {
    response.headers.set("Location", _res.redirect)
  }

  return response
}
