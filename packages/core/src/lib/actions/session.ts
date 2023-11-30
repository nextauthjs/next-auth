import { JWTSessionError, SessionTokenError } from "../../errors.js"
import { fromDate } from "../utils/date.js"

import type { Adapter, AdapterUser } from "../../adapters.js"
import type { InternalOptions, ResponseInternal, Session } from "../../types.js"
import type { Cookie, SessionStore } from "../utils/cookie.js"
import { JWT } from "../../jwt.js"

const makeSessionObject = (
  payload: JWT | AdapterUser,
  sessionExpireDateString: string
): Session => {
  return {
    // @ts-expect-error
    user: {
      name: payload.name,
      email: payload.email,
      // @ts-expect-error
      image: payload.picture ?? payload.image,
    },
    expires: sessionExpireDateString,
  }
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
    session: {
      strategy: sessionStrategy,
      maxAge: sessionMaxAge,
      updateAge: sessionUpdateAge,
    },
  } = options

  const response: ResponseInternal<Session | null> = {
    body: null,
    headers: { "Content-Type": "application/json" },
    cookies,
  }

  const sessionToken = sessionStore.value

  if (!sessionToken) return response

  switch (sessionStrategy) {
    case "jwt":
      try {
        const salt = options.cookies.sessionToken.name

        const decodedTokenPayload = await jwt.decode({
          ...jwt,
          token: sessionToken,
          salt,
        })

        if (!decodedTokenPayload) throw new Error("Invalid JWT")

        // @ts-expect-error
        const token = (await callbacks.jwt({
          token: decodedTokenPayload,
          trigger: isUpdate ? "update" : undefined,
          session: newSession,
        })) as JWT & { exp: number }

        if (!token) throw new Error("Invalid JWT")

        const sessionIsDueToBeUpdatedDate =
          (token.exp - sessionUpdateAge) * 1000

        // if seesion not yet hit the updateAge
        if (sessionIsDueToBeUpdatedDate > Date.now()) {
          const currentSession = await callbacks.session(
            // @ts-expect-error
            {
              session: makeSessionObject(
                token,
                new Date(token.exp * 1000).toISOString()
              ),
              token,
            }
          )

          response.body = currentSession

          await events.session?.({
            session: currentSession,
            token,
          })
        }
        // if seesion passed updateAge
        else {
          const newExpires = fromDate(sessionMaxAge, Date.now())

          // Refresh JWT expiry by re-signing it, with an updated expiry date
          const newToken = await jwt.encode({
            ...jwt,
            // pass the original user token back
            token,
            salt,
          })

          // must decode the new token for passing back to the session, otherwise the jti, exp, etc. will be previous.
          const decodedNewTokenPayload = (await jwt.decode({
            ...jwt,
            token: newToken,
            salt,
          })) as JWT

          // By default, only exposes a limited subset of information to the client
          // as needed for presentation purposes (e.g. "you are logged in as...").
          const refreshedSession = await callbacks.session(
            // @ts-expect-error
            {
              session: makeSessionObject(
                decodedNewTokenPayload,
                // jti precision is only up to second, so zero out the milli-second
                new Date(
                  Math.floor(newExpires.valueOf() / 1000) * 1000
                ).toISOString()
              ),
              token: decodedNewTokenPayload,
            }
          )

          // Return session payload as response
          response.body = refreshedSession

          // Set cookie, to also update expiry date on cookie
          const sessionCookies = sessionStore.chunk(newToken, {
            expires: newExpires,
          })

          response.cookies?.push(...sessionCookies)

          await events.session?.({
            session: refreshedSession,
            token: decodedNewTokenPayload,
          })
        }
      } catch (e) {
        logger.error(new JWTSessionError(e as Error))
        // If the JWT is not verifiable remove the broken session cookie(s).
        response.cookies?.push(...sessionStore.clean())
      }

      return response

    case "database":
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
            await updateSession({
              sessionToken: sessionToken,
              expires: newExpires,
            })
          }

          // Pass Session through to the session callback
          const sessionPayload = await callbacks.session(
            // @ts-expect-error
            {
              // By default, only exposes a limited subset of information to the client
              // as needed for presentation purposes (e.g. "you are logged in as...").
              session: makeSessionObject(user, session.expires.toISOString()),
              user,
              newSession,
              ...(isUpdate ? { trigger: "update" } : {}),
            }
          )

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
      } catch (e) {
        logger.error(new SessionTokenError(e as Error))
      }

      return response
    default:
      throw new Error(
        `session strategy '${sessionStrategy}' can not be recognized, acceptable values are 'jwt' or 'database'`
      )
  }
}
