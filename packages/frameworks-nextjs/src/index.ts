import { Auth } from "@auth/core"
import { setEnvDefaults } from "./lib/env.js"
import { initAuth } from "./lib/index.js"

import type { NextRequest } from "next/server"
import type { NextAuthConfig, NextAuthCallbacks } from "./lib/index.js"

type AppRouteHandlers = Record<
  "GET" | "POST",
  (req: NextRequest) => Promise<Response>
>

export type { NextAuthConfig, NextAuthCallbacks }

/**
 * The result of invoking {@link NextAuth}, initialized with the {@link NextAuthConfig}.
 * It contains methods to set up and interact with Next.js Auth in your Next.js app.
 */
export interface NextAuthResult {
  /**
   * The Next.js Auth [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers) methods. After initializing Next.js Auth in `auth.ts`,
   * export these methods from under `app/api/auth/[...nextauth]/route.ts`.
   *
   * @example
   * ```ts title="app/api/auth/[...nextauth]/route.ts"
   * import { handlers } from "auth"
   * export const { GET, POST } = handlers
   * ```
   */
  handlers: AppRouteHandlers
  auth: any
}

/**
 *  Initialize Next.js Auth.
 *
 *  @example
 * ```ts title="auth.ts"
 * import { NextAuth } from "@auth/nextjs"
 * import GitHub from "@auth/core/providers/github"
 *
 * export const { handlers, auth } = NextAuth({ providers: [GitHub] })
 * ```
 */
export function NextAuth(config: NextAuthConfig): NextAuthResult {
  setEnvDefaults(config)
  const httpHandler = (req: NextRequest) => Auth(req, config)
  return {
    handlers: { GET: httpHandler, POST: httpHandler } as const,
    auth: initAuth(config),
  }
}
