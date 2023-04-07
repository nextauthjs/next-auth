import { Auth, type AuthConfig } from "@auth/core"
import { setEnvDefaults } from "./lib/env"
import { headers as $headers } from "next/headers"

import type { Awaitable, Session, User } from "@auth/core/types"
import { NextRequest, NextResponse } from "next/server"
import { JWT } from "@auth/core/jwt"
import { getAuth, createWithAuth, AuthData } from "./lib/with-auth"

// TODO: polyfill in Next.js
if (typeof globalThis.crypto === "undefined")
  globalThis.crypto = require("node:crypto").webcrypto

export interface NextAuthConfig extends AuthConfig {
  callbacks: AuthConfig["callbacks"] & {
    /**
     * Invoked when a user needs authorization. It uses Middleware to
     * intercept requests.
     *
     * By default, it checks if the user is logged in, if not, it redirects
     * to the login page.
     *
     * You can override this behavior by returning a {@link NextResponse}
     *
     * @example
     * ```ts title="app/auth.ts"
     * ...
     * async authorized({ request, auth }) {
     *   const url = new URL(request.url)
     *
     *   if(request.method === "POST") {
     *     const { authToken } = (await request.json()) ?? {}
     *     // If the request has a valid auth token, it is authorized
     *     const valid = await validateAuthToken(authToken)
     *     if(valid) return true
     *     return NextResponse.json("Invalid auth token", { status: 401 })
     *   }
     *
     *   // Logged in users are authorized, otherwise, will redirect to login
     *   return !!auth
     * }
     * ...
     * ```
     */
    authorized: (params: {
      request: NextRequest
      auth: JWT | User | null
    }) => Awaitable<boolean | NextResponse>
  }
}

/**
 * The main entry point to Next.js Auth.
 * Using [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers)
 */
export default function NextAuth(config: NextAuthConfig) {
  setEnvDefaults(config)
  const withAuth = createWithAuth(config)

  return {
    GET: async (req: NextRequest) => Auth(req, config),
    POST: async (req: NextRequest) => Auth(req, config),

    /**
     * Get the current session from the server inside Route Handlers and Server Components.
     */
    async getSession() {
      return getAuth(new Headers($headers()), config) as Promise<AuthData>
    },
    /** TODO: */
    withAuth,
    providers() {
      return config.providers.reduce<Record<string, any>>(
        (acc, { id, name, type, signinUrl, callbackUrl }: any) => {
          acc[id] = { id, name, type, signinUrl, callbackUrl }
          return acc
        },
        {}
      )
    },
  }
}
