import { AuthHandler, AuthOptions } from '@auth/core'
import { fromNodeMiddleware } from 'h3'
import { createMiddleware } from "@hattip/adapter-node";

export function NuxtAuthHandler (options: AuthOptions) {
  async function handler(ctx: { request: Request }) {
    return AuthHandler(ctx.request, {
      ...options,
      trustHost: Boolean(process.env.AUTH_TRUST_HOST)
    })
  }

  const middleware = createMiddleware(handler)

  return fromNodeMiddleware(middleware)
}
