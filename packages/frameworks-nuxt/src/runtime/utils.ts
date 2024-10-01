import type { H3Event } from "h3"
import type { RuntimeConfig } from "nuxt/schema"
import { getRequestHeaders, getRequestURL, readRawBody } from "h3"

/**
 * This should be a function in H3
 * @param event
 * @returns
 */
export async function getRequestFromEvent(event: H3Event) {
  const url = new URL(getRequestURL(event))
  const method = event.method
  const body = method === "POST" ? await readRawBody(event) : undefined
  return new Request(url, {
    headers: getRequestHeaders(event) as HeadersInit,
    method,
    body,
  })
}

export function checkOrigin(
  request: Request,
  runtimeConfig: Partial<RuntimeConfig>
) {
  if (process.env.NODE_ENV === "development") return
  if (request.method !== "POST") return // Only check post requests

  const requestOrigin = request.headers.get("Origin")
  const serverOrigin = runtimeConfig.authJs?.baseUrl
  if (serverOrigin !== requestOrigin) throw new Error("CSRF protected")
}

export function getBasePath(req: Request) {
  return req.url.replace(/\/$/, "")
}
