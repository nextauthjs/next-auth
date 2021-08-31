import * as cookie from "../lib/cookie"

/**
 * Handle requests to /api/auth/signout
 * @param {import("src/lib/types").NextAuthRequest} req
 * @param {import("src/lib/types").NextAuthResponse} res
 */
export default async function signout(req, res) {
  const { adapter, cookies, events, jwt, callbackUrl, logger } = req.options
  const useJwtSession = req.options.session.jwt
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (useJwtSession) {
    // Dispatch signout event
    try {
      const decodedJwt = await jwt.decode({ ...jwt, token: sessionToken })
      await events.signOut?.({ token: decodedJwt })
    } catch (error) {
      // Do nothing if decoding the JWT fails
    }
  } else {
    try {
      const session = await adapter.deleteSession(sessionToken)
      // Dispatch signout event
      await events.signOut?.({ session })
    } catch (error) {
      // If error, log it but continue
      logger.error("SIGNOUT_ERROR", error)
    }
  }

  // Remove Session Token
  cookie.set(res, cookies.sessionToken.name, "", {
    ...cookies.sessionToken.options,
    maxAge: 0,
  })

  return res.redirect(callbackUrl)
}
