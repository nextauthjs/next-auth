import { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "cookie"

/** If `NEXTAUTH_URL` or `AUTH_URL` is defined, override the request's URL. */
export function reqWithEnvURL(req: NextApiRequest): Request {
  const authUrl = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL

  // Get the protocol, host, and path from the request
  const protocol = req.headers["x-forwarded-proto"] || "https"
  const host = req.headers["x-forwarded-host"] || req.headers["host"]
  const path = req.url || "/"

  // Base URL from request
  const baseUrl = `${protocol}://${host}`

  // Override with environment URL if defined
  const url = authUrl
    ? new URL(path, authUrl).toString()
    : new URL(path, baseUrl).toString()

  // Create headers from request headers
  const headers = new Headers()
  Object.entries(req.headers).forEach(([key, value]) => {
    if (value)
      headers.append(key, Array.isArray(value) ? value.join(", ") : value)
  })

  // Convert body depending on content type
  let body: BodyInit | null = null
  const contentType = req.headers["content-type"]

  if (req.body) {
    if (contentType?.includes("application/json")) {
      body = JSON.stringify(req.body)
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams()
      Object.entries(req.body).forEach(([key, value]) => {
        params.append(key, String(value))
      })
      body = params
    } else if (typeof req.body === "string") {
      body = req.body
    }
  }

  // Create and return a proper Request object
  return new Request(url, {
    method: req.method || "GET",
    headers,
    body,
  })
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

export function setCookie(
  res: NextApiResponse,
  cookie: string | Record<string, unknown>
): void {
  // Preserve any existing cookies that have already been set in the same session

  let cookieValue: string

  // Handle the case where cookie is a string (already formatted)
  if (typeof cookie === "string") {
    cookieValue = cookie
  }
  // Handle the case where cookie is an object with name, value, options
  else if (typeof cookie === "object") {
    const { name, value, options } = cookie
    if (!name || !value) {
      console.warn("Invalid cookie", cookie)
      return
    }
    cookieValue = serialize(name as string, value as string, options as any)
  } else {
    console.warn("Invalid cookie format", cookie)
    return
  }

  res.setHeader("Set-Cookie", [cookieValue])
}
