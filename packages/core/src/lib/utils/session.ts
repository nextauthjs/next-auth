import type { InternalConfig, User } from "../../types.js"

/** Returns the currently logged in user, if any. */
export async function getLoggedInUser(
  config: InternalConfig
): Promise<User | null> {
  const { adapter, session, sessionStore } = config

  const sessionCookie = sessionStore.value
  if (!sessionCookie) return null

  if (session.isDatabase) {
    const userAndSession = await adapter?.getSessionAndUser(sessionCookie)
    if (userAndSession) return userAndSession.user
  }

  const payload = await session.unseal(sessionCookie)

  if (!payload?.sub) return null

  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    image: payload.picture,
  }
}
