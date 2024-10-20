import { SignOutError } from "../../errors.js"

import type { InternalConfig, ResponseInternal } from "../../types.js"

/**
 * Destroys the session.
 * If the session strategy is database,
 * The session is also deleted from the database.
 * In any case, the session cookie is cleared and
 * {@link AuthConfig["events"].signOut} is emitted.
 */
export async function signOut(
  config: InternalConfig
): Promise<ResponseInternal> {
  const {
    events,
    callbackUrl: redirect,
    logger,
    session,
    resCookies: cookies,
    sessionStore,
  } = config
  const sessionToken = sessionStore.value
  if (!sessionToken) return { redirect, cookies }

  try {
    if (session.isDatabase) {
      const session = await config.adapter?.deleteSession(sessionToken)
      await events.signOut?.({ session })
    } else {
      const token = await session.unseal(sessionToken)
      await events.signOut?.({ token })
    }
  } catch (e) {
    logger.error(new SignOutError(e as Error))
  }

  cookies.push(...sessionStore.clean())

  return { redirect, cookies }
}
