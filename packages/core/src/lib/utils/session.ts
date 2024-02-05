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
    session: { strategy: sessionStrategy },
  } = options

  const sessionToken = sessionStore.value
  if (!sessionToken) return null

  // Try to decode JWT
  if (sessionStrategy === "jwt") {
    const salt = options.cookies.sessionToken.name
    const payload = await jwt.decode({ ...jwt, token: sessionToken, salt })

    if (payload && payload.sub) {
      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      }
    }
  } else {
    const userAndSession = await adapter?.getSessionAndUser(sessionToken)
    if (userAndSession) {
      return userAndSession.user
    }
  }

  return null
}
