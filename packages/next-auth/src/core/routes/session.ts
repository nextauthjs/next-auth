import { fromDate } from "../lib/utils"

import type { InternalOptions } from "../types"
import type { ResponseInternal } from ".."
import type { Session } from "../.."
import type { SessionStore } from "../lib/cookie"

interface SessionParams {
  options: InternalOptions
  sessionStore: SessionStore
  isUpdate?: boolean
  newSession?: any
}

/**
 * Return a session object (without any private fields)
 * for Single Page App clients
 */

export default async function session(
  params: SessionParams
): Promise<ResponseInternal<Session | {}>> {
  const { options, sessionStore, newSession, isUpdate } = params
  const {
    adapter,
    jwt,
    events,
    callbacks,
    logger,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
  } = options

  const response: ResponseInternal<Session | {}> = {
    body: {},
    headers: [{ key: "Content-Type", value: "application/json" }],
    cookies: [],
  }

  const sessionToken = sessionStore.value

  if (!sessionToken) return response

  if (sessionStrategy === "jwt") {
    try {
      const decodedToken = await jwt.decode({ ...jwt, token: sessionToken })

      if (!decodedToken) throw new Error("JWT invalid")

      // @ts-expect-error
      const token = await callbacks.jwt({
        token: decodedToken,
        ...(isUpdate && { trigger: "update" }),
        session: newSession,
      })

      const newExpires = fromDate(sessionMaxAge)

      // By default, only exposes a limited subset of information to the client
      // as needed for presentation purposes (e.g. "you are logged in as...").

      // @ts-expect-error Property 'user' is missing in type
      const updatedSession = await callbacks.session({
        session: {
          user: {
            name: decodedToken?.name,
            email: decodedToken?.email,
            image: decodedToken?.picture,
          },
          expires: newExpires.toISOString(),
        },
        token,
      })

      // Return session payload as response
      response.body = updatedSession

      // Refresh JWT expiry by re-signing it, with an updated expiry date
      const newToken = await jwt.encode({
        ...jwt,
        token,
        maxAge: options.session.maxAge,
      })

      // Set cookie, to also update expiry date on cookie
      const sessionCookies = sessionStore.chunk(newToken, {
        expires: newExpires,
      })

      response.cookies?.push(...sessionCookies)

      await events.session?.({ session: updatedSession, token })
    } catch (error) {
      // If JWT not verifiable, make sure the cookie for it is removed and return empty object
      logger.error("JWT_SESSION_ERROR", error as Error)

      response.cookies?.push(...sessionStore.clean())
    }
  } else {
    try {
      // @ts-expect-error -- adapter is checked to be defined in `init`
      const { getSessionAndUser, deleteSession, updateSession } =
        adapter
      let userAndSession = await getSessionAndUser(sessionToken)

      // If session has expired, clean up the database
      if (
        userAndSession &&
        userAndSession.session.expires.valueOf() < Date.now()
      ) {
        await deleteSession(sessionToken)
        userAndSession = null
      }

      if (userAndSession) {
        const { user, session } = userAndSession

        const sessionUpdateAge = options.session.updateAge
        // Calculate last updated date to throttle write updates to database
        // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
        //     e.g. ({expiry date} - 30 days) + 1 hour
        const sessionIsDueToBeUpdatedDate =
          session.expires.valueOf() -
          sessionMaxAge * 1000 +
          sessionUpdateAge * 1000

        const newExpires = fromDate(sessionMaxAge)
        // Trigger update of session expiry date and write to database, only
        // if the session was last updated more than {sessionUpdateAge} ago
        if (sessionIsDueToBeUpdatedDate <= Date.now()) {
          await updateSession({ sessionToken, expires: newExpires })
        }

        // Pass Session through to the session callback

        // @ts-expect-error Property 'token' is missing in type
        const sessionPayload = await callbacks.session({
          // By default, only exposes a limited subset of information to the client
          // as needed for presentation purposes (e.g. "you are logged in as...").
          session: {
            user: { name: user.name, email: user.email, image: user.image },
            expires: session.expires.toISOString(),
          },
          user,
          newSession,
          ...(isUpdate ? { trigger: "update" } : {}),
        })

        // Return session payload as response
        response.body = sessionPayload

        // Set cookie again to update expiry
        response.cookies?.push({
          name: options.cookies.sessionToken.name,
          value: sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: newExpires,
          },
        })

        // @ts-expect-error
        await events.session?.({ session: sessionPayload })
      } else if (sessionToken) {
        // If `sessionToken` was found set but it's not valid for a session then
        // remove the sessionToken cookie from browser.
        response.cookies?.push(...sessionStore.clean())
      }
    } catch (error) {
      logger.error("SESSION_ERROR", error as Error)
    }
  }

  return response
}
