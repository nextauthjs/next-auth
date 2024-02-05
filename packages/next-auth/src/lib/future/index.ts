import type { Session, User } from "@auth/core/types"

import type { NextAuthConfig } from ".."
import { headers } from "next/headers"
import { Auth } from "@auth/core"
import { createActionURL } from "../actions"
import { AuthError } from "@auth/core/errors"
import { NextRequest } from "next/server"

export interface AuthData {
  session: Session
  user: User
}

class ExperimentalAuthError extends AuthError {
  static type = "ExperimentalAuthError"
}

async function getAuthData(
  headers: Headers,
  config: NextAuthConfig
): Promise<Session | null> {
  return Auth(
    new Request(createActionURL("session", headers, config.basePath), {
      headers: { cookie: headers.get("cookie") ?? "" },
    }),
    {
      ...config,
      callbacks: {
        ...config.callbacks,
        // TODO: Taint the session data to prevent accidental leakage to the client
        // https://react.dev/reference/react/experimental_taintObjectReference
        async session(...args) {
          // Use the user defined session callback if it exists
          let session = await config.callbacks?.session?.(...args)
          // User wants to terminate the session, exit early
          if (session === null) return null
          // User did not define a custom session callback, use the default session value
          if (!session) session = args[0].session
          // @ts-expect-error either user or token will be defined
          const user = session.user ?? args[0].user ?? args[0].token
          // Structured auth data always requires a user object
          if (!user) throw new TypeError("Missing user in structured auth data")
          return { user, ...session } satisfies Session
        },
      },
    } as NextAuthConfig
    // REVIEW: This won't forward headers (eg.: Set-Cookie that terminates the session by returning null in the session callback)
  ).then((r) => r.json())
}

async function handleAuth(config: NextAuthConfig): Promise<AuthData | null> {
  const data = await getAuthData(headers(), config)
  if (!data) return null
  const { user, ...session } = data
  if (!user) throw new TypeError("Missing user in structured auth data")
  return { session, user }
}

function experimentalStructuredAuthEnabled(config: NextAuthConfig) {
  if (config.experimental?.structuredAuth === true) return
  throw new ExperimentalAuthError(
    "`experimental.structuredAuth` must be enabled to use `unstable_auth`"
  )
}
function experimentalUpdateAccountOnLoginEnabled(config: NextAuthConfig) {
  if (config.experimental?.updateAccountOnLogin === true) return
  throw new ExperimentalAuthError(
    "`experimental.updateAccountOnLogin` must be enabled to use `updateAccount()`"
  )
}

export function initFutureAuth(
  configOrFunction:
    | NextAuthConfig
    | ((request: NextRequest | undefined) => NextAuthConfig),
  onLazyInit?: (config: NextAuthConfig) => void
) {
  if (typeof configOrFunction === "function") {
    return async () => {
      const config = configOrFunction(undefined) // Review: Should we pass headers()?
      experimentalStructuredAuthEnabled(config)
      experimentalUpdateAccountOnLoginEnabled(config)
      onLazyInit?.(config)
      return await handleAuth(config)
    }
  }

  experimentalStructuredAuthEnabled(configOrFunction)
  return async () => await handleAuth(configOrFunction)
}