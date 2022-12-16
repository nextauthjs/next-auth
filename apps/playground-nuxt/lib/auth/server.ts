import { AuthHandler, AuthOptions, Session } from '@auth/core'
import { fromNodeMiddleware, H3Event } from 'h3'
import getURL from 'requrl'
import { createMiddleware } from "@hattip/adapter-node";

export function NuxtAuthHandler (options: AuthOptions) {
  async function handler(ctx: { request: Request }) {
    options.trustHost ??= true

    return AuthHandler(ctx.request, options)
  }

  const middleware = createMiddleware(handler)

  return fromNodeMiddleware(middleware)
}

export async function getSession(
  event: H3Event,
  options: AuthOptions
): Promise<Session | null> {
  options.trustHost ??= true

  const headers = getRequestHeaders(event)
  const nodeHeaders = new Headers()

  const url = new URL('/api/auth/session', getURL(event.node.req))

  Object.keys(headers).forEach((key) => {
    nodeHeaders.append(key, headers[key] as any)
  })

  const response = await AuthHandler(
    new Request(url, { headers: nodeHeaders }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
