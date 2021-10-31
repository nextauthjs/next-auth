import { Adapter } from "src/adapters"
import { InternalOptions } from "../../lib/types"
import { OutgoingResponse } from ".."
import { Cookie } from "../lib/cookie"

/** Handle requests to /api/auth/signout */
export default async function signout(params: {
  options: InternalOptions
  sessionToken?: string
}): Promise<OutgoingResponse> {
  const { options, sessionToken } = params
  const { adapter, cookies, events, jwt, callbackUrl, logger } = options

  if (!sessionToken) {
    return { redirect: callbackUrl }
  }

  const useJwtSession = options.session.jwt

  if (useJwtSession) {
    // Dispatch signout event
    try {
      const decodedJwt = await jwt.decode({ ...jwt, token: sessionToken })
      // @ts-expect-error
      await events.signOut?.({ token: decodedJwt })
    } catch (error) {
      // Do nothing if decoding the JWT fails
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
  const sessionCookie: Cookie = {
    name: cookies.sessionToken.name,
    value: "",
    options: { ...cookies.sessionToken.options, maxAge: 0 },
  }

  return { redirect: callbackUrl, cookies: [sessionCookie] }
}
