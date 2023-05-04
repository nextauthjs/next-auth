import type { Adapter } from "../../adapters"
import type { InternalOptions } from "../types"
import type { ResponseInternal } from ".."
import type { SessionStore } from "../lib/cookie"

/** Handle requests to /api/auth/signout */
export default async function signout(params: {
  options: InternalOptions
  sessionStore: SessionStore
}): Promise<ResponseInternal> {
  const { options, sessionStore } = params
  const { adapter, events, jwt, callbackUrl, logger, session } = options

  const sessionToken = sessionStore?.value
  if (!sessionToken) {
    return { redirect: callbackUrl }
  }

  if (session.strategy === "jwt") {
    // Dispatch signout event
    try {
      const decodedJwt = await jwt.decode({ ...jwt, token: sessionToken })
      // @ts-expect-error
      await events.signOut?.({ token: decodedJwt })
    } catch (error) {
      // Do nothing if decoding the JWT fails
      logger.error("SIGNOUT_ERROR", error)
    }
  } else {
    try {
      const session = await (adapter as Adapter).deleteSession(sessionToken)
      // Dispatch signout event
      // @ts-expect-error
      await events.signOut?.({ session })
    } catch (error) {
      // If error, log it but continue
      logger.error("SIGNOUT_ERROR", error as Error)
    }
  }

  // Remove Session Token
  const sessionCookies = sessionStore.clean()

  return { redirect: callbackUrl, cookies: sessionCookies }
}
