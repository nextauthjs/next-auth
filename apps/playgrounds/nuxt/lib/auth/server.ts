import { AuthConfig, Session } from "@auth/core/types"
import { Auth } from "@auth/core"
import { fromNodeMiddleware, getRequestURL, H3Event } from "h3"
import { createMiddleware } from "@hattip/adapter-node"

export function NuxtAuthHandler(options: AuthConfig) {
  async function handler(ctx: { request: Request }) {
    options.trustHost ??= true

    return Auth(ctx.request, options)
  }

  const middleware = createMiddleware(handler)

  return fromNodeMiddleware(middleware)
}

export async function getSession(
  event: H3Event,
  options: AuthConfig
): Promise<Session | null> {
  options.trustHost ??= true

  const headers = getRequestHeaders(event)
  const nodeHeaders = new Headers()

  const url = new URL("/api/auth/session", getRequestURL(event))

  Object.keys(headers).forEach((key) => {
    nodeHeaders.append(key, headers[key] as any)
  })

  const response = await Auth(
    new Request(url, { headers: nodeHeaders }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
