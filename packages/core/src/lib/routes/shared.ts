import { AuthorizedCallbackError } from "../../errors.js"
import { InternalOptions } from "../../types.js"

import type { Adapter, AdapterUser } from "../../adapters.js"

export async function handleAuthorized(
  params: any,
  { url, logger, callbacks: { signIn } }: InternalOptions
) {
  try {
    const authorized = await signIn(params)
    if (!authorized) {
      url.pathname += "/error"
      logger.debug("User not authorized", params)
      url.searchParams.set("error", "AccessDenied")
      return { status: 403 as const, redirect: url.toString() }
    }
  } catch (e) {
    url.pathname += "/error"
    const error = new AuthorizedCallbackError(e as Error)
    logger.error(error)
    url.searchParams.set("error", "Configuration")
    return { status: 500 as const, redirect: url.toString() }
  }
}

/**
 * Query the database for a user by email address.
 * If it's an existing user, return a user object,
 * otherwise use placeholder.
 */
export async function getAdapterUserFromEmail(
  email: string,
  adapter: Adapter
): Promise<AdapterUser> {
  const user = await adapter.getUserByEmail(email)
  return user ?? { id: email, email, emailVerified: null }
}
