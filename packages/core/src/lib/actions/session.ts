import { JWTSessionError, SessionTokenError } from "../../errors.js"
import { fromDate } from "../utils/date.js"

import type { Adapter } from "../../adapters.js"
import type { InternalOptions, ResponseInternal, Session, User } from "../../types.js"
import type { Cookie, SessionStore } from "../utils/cookie.js"
import type { JWT } from "../../jwt.js"

/**
 * Resolve the maxAge value for session cookies.
 * Handles static values, "session" for session cookies, and dynamic functions.
 */
async function resolveMaxAge(
  maxAge: InternalOptions["session"]["maxAge"],
  params: {
    user?: User
    token?: JWT
    trigger?: "signIn" | "signUp" | "update"
    isNewUser?: boolean
    session?: any
  }
): Promise<number | "session"> {
  if (typeof maxAge === "function") {
    return await maxAge(params)
  }
  return maxAge
}

/** Return a session object filtered via `callbacks.session` */
export async function session(
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[],
  isUpdate?: boolean,
  newSession?: any
): Promise<ResponseInternal<Session | null>> {
  const {
    adapter,
    jwt,
    events,
    callbacks,
    logger,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
  } = options

  const response: ResponseInternal<Session | null> = {
    body: null,
    headers: {
      "Content-Type": "application/json",
      ...(!isUpdate && {
        "Cache-Control": "private, no-cache, no-store",
        Expires: "0",
        Pragma: "no-cache",
      }),
    },
    cookies,
  }

  const sessionToken = sessionStore.value

  if (!sessionToken) return response

  if (sessionStrategy === "jwt") {
    try {
      const salt = options.cookies.sessionToken.name
      const payload = await jwt.decode({ ...jwt, token: sessionToken, salt })

      if (!payload) throw new Error("Invalid JWT")

      // @ts-expect-error
      const token = await callbacks.jwt({
        token: payload,
        ...(isUpdate && { trigger: "update" }),
        session: newSession,
      })

      const resolvedMaxAge = await resolveMaxAge(sessionMaxAge, {
        token,
        trigger: isUpdate ? "update" : undefined,
        session: newSession,
      })

      const newExpires = resolvedMaxAge === "session" 
        ? fromDate(30 * 24 * 60 * 60) // Use a default for internal calculations
        : fromDate(resolvedMaxAge)

      if (token !== null) {
        // By default, only exposes a limited subset of information to the client
        // as needed for presentation purposes (e.g. "you are logged in as...").
        const session = {
          user: { name: token.name, email: token.email, image: token.picture },
          expires: newExpires.toISOString(),
        }
        // @ts-expect-error
        const newSession = await callbacks.session({ session, token })

        // Return session payload as response
        response.body = newSession

        // Refresh JWT expiry by re-signing it, with an updated expiry date
        const newToken = await jwt.encode({ ...jwt, token, salt })

        // Set cookie, to also update expiry date on cookie
        const cookieOptions: { expires?: Date } = {}
        if (resolvedMaxAge !== "session") {
          cookieOptions.expires = newExpires
        }
        
        const sessionCookies = sessionStore.chunk(newToken, cookieOptions)

        response.cookies?.push(...sessionCookies)

        await events.session?.({ session: newSession, token })
      } else {
        response.cookies?.push(...sessionStore.clean())
      }
    } catch (e) {
      logger.error(new JWTSessionError(e as Error))
      // If the JWT is not verifiable remove the broken session cookie(s).
      response.cookies?.push(...sessionStore.clean())
    }

    return response
  }

  // Retrieve session from database
  try {
    const { getSessionAndUser, deleteSession, updateSession } =
      adapter as Required<Adapter>
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

      // Resolve maxAge for database sessions
      const resolvedMaxAge = await resolveMaxAge(sessionMaxAge, {
        user,
        trigger: isUpdate ? "update" : undefined,
        session: newSession,
      })

      // For database sessions, we need a numeric value
      const numericMaxAge = resolvedMaxAge === "session" ? sessionMaxAge : resolvedMaxAge
      
      // Calculate last updated date to throttle write updates to database
      // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
      //     e.g. ({expiry date} - 30 days) + 1 hour
      const sessionIsDueToBeUpdatedDate =
        session.expires.valueOf() -
        numericMaxAge * 1000 +
        sessionUpdateAge * 1000

      const newExpires = fromDate(numericMaxAge)
      // Trigger update of session expiry date and write to database, only
      // if the session was last updated more than {sessionUpdateAge} ago
      if (sessionIsDueToBeUpdatedDate <= Date.now()) {
        await updateSession({
          sessionToken: sessionToken,
          expires: newExpires,
        })
      }

      // Pass Session through to the session callback
      const sessionPayload = await callbacks.session({
        // TODO: user already passed below,
        // remove from session object in https://github.com/nextauthjs/next-auth/pull/9702
        // @ts-expect-error
        session: { ...session, user },
        user,
        newSession,
        ...(isUpdate ? { trigger: "update" } : {}),
      })

      // Return session payload as response
      response.body = sessionPayload

      // Set cookie again to update expiry
      const cookieOptions = { ...options.cookies.sessionToken.options }
      if (resolvedMaxAge !== "session") {
        cookieOptions.expires = newExpires
      }
      
      response.cookies?.push({
        name: options.cookies.sessionToken.name,
        value: sessionToken,
        options: cookieOptions,
      })

      // @ts-expect-error
      await events.session?.({ session: sessionPayload })
    } else if (sessionToken) {
      // If `sessionToken` was found set but it's not valid for a session then
      // remove the sessionToken cookie from browser.
      response.cookies?.push(...sessionStore.clean())
    }
  } catch (e) {
    logger.error(new SessionTokenError(e as Error))
  }

  return response
}
