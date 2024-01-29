import { JWTSessionError, SessionTokenError } from "../../errors";
import type { InternalOptions, User } from "../../types";
import type { SessionStore } from "./cookie";

/**
 * Returns the currently logged in user, if any.
 */
export async function getLoggedInUser(
  options: InternalOptions,
  sessionStore: SessionStore
): Promise<User | null> {
  const {
    adapter,
    jwt,
    logger,
    session: { strategy: sessionStrategy },
  } = options

  const sessionToken = sessionStore.value
  if (!sessionToken) return null

  // Try to decode JWT
  if (sessionStrategy === "jwt") {
    try {
      const salt = options.cookies.sessionToken.name
      const payload = await jwt.decode({ ...jwt, token: sessionToken, salt })

      if (!payload || !payload.sub) throw new Error("Invalid JWT")

      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      } satisfies User
    } catch (e) {
      logger.error(new JWTSessionError(e as Error))
    }

    return null
  }

  // Retrieve session from database
  try {
    let userAndSession = await adapter?.getSessionAndUser(sessionToken)
    if (!userAndSession) return null

    return userAndSession.user
  } catch (e) {
    logger.error(new SessionTokenError(e as Error))
  }

  return null
}
