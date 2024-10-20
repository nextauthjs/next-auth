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
    jwt,
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
    if (session.strategy === "jwt") {
      const salt = config.cookies.sessionToken.name
      const token = await jwt.decode({ ...jwt, token: sessionToken, salt })
      await events.signOut?.({ token })
    } else {
      const session = await config.adapter?.deleteSession(sessionToken)
      await events.signOut?.({ session })
    }
  } catch (e) {
    logger.error(new SignOutError(e as Error))
  }

  cookies.push(...sessionStore.clean())

  return { redirect, cookies }
}
