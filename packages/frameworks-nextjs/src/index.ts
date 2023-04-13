import { Auth } from "@auth/core"
import { setEnvDefaults } from "./lib/env.js"
import { initAuth } from "./lib/index.js"

import type { NextRequest } from "next/server"
import type { NextAuthConfig } from "./lib/index.js"

export type { NextAuthConfig }

// TODO: polyfill in Next.js
if (typeof globalThis.crypto === "undefined")
  globalThis.crypto = require("node:crypto").webcrypto

/**
 * The main entry point to Next.js Auth.
 * Using [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers)
 */
export default function NextAuth(config: NextAuthConfig) {
  setEnvDefaults(config)
  return {
    /**
     * The Next.js Auth Route Handler.
     *
     * @example
     * ```ts title="app/api/auth/[...nextauth]/route.ts"
     * import { handler } from "auth"
     * export const { GET, POST } = handler
     * ```
     */
    handler: {
      GET: (req: NextRequest) => Auth(req, config),
      POST: (req: NextRequest) => Auth(req, config),
    },
    /**
     * Universal method to get the current auth state anywhere in your app.
     * Works in Server Components, Route Handlers as well as Middleware.
     */
    auth: initAuth(config),
  }
}
