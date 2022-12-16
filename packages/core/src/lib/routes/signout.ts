import { SignOutError } from "../errors.js"

import type { AuthConfigInternal, ResponseInternal } from "../../index.js"
import type { SessionStore } from "../cookie.js"

/**
 * Destroys the session.
 * If the session strategy is database,
 * The session is also deleted from the database.
 * In any case, the session cookie is cleared and
 * an `events.signOut` is emitted.
 */
export async function signout(
  sessionStore: SessionStore,
  config: AuthConfigInternal
): Promise<ResponseInternal> {
  const { jwt, events, callbackUrl: redirect, logger, session } = config

  const sessionToken = sessionStore.value
  if (!sessionToken) return { redirect }

  try {
    if (session.strategy === "jwt") {
      const token = await jwt.decode({ ...jwt, token: sessionToken })
      await events.signOut?.({ token })
    } else {
      const session = await config.adapter?.deleteSession(sessionToken)
      await events.signOut?.({ session })
    }
  } catch (error) {
    logger.error(new SignOutError(error))
  }

  return { redirect, cookies: sessionStore.clean() }
}
