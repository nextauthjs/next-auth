import type { InternalConfig, User } from "../../types.js"

/**
 * Returns the currently logged in user, if any.
 */
export async function getLoggedInUser(
  config: InternalConfig
): Promise<User | null> {
  const {
    adapter,
    jwt,
    session: { strategy: sessionStrategy },
    sessionStore,
  } = config

  const sessionToken = sessionStore.value
  if (!sessionToken) return null

  // Try to decode JWT
  if (sessionStrategy === "jwt") {
    const salt = config.cookies.sessionToken.name
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
