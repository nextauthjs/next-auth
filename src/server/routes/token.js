import * as cookie from "../lib/cookie"

/**
 * Takes a set of old tokens, and refreshes them.
 * @param {import("types").TokenSet} tokens
 * @param {import("types/providers").OAuthConfig} provider
 */
async function refreshTokens(
  tokens,
  { accessTokenUrl, clientId, clientSecret }
) {
  try {
    const response = await fetch(accessTokenUrl, {
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: tokens.refresh_token,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    /** @type {import("types").TokenSet} */
    const newTokens = await response.json()

    if (!response.ok) {
      // eslint-disable-next-line no-throw-literal
      throw newTokens
    }

    return {
      ...tokens,
      access_token: newTokens.access_token,
      expires: Date.now() + newTokens.expires_in * 1000,
      // Default to previous `refresh_token`, in case it isn't sliding
      refresh_token: newTokens.refresh_token ?? tokens.refresh_token,
    }
  } catch (error) {
    return { ...tokens, access_token: null, refresh_token: null, expires: 0 }
  }
}

/**
 * Handle requests to /api/auth/token
 * @type {import("types/internals").NextAuthHandler}
 */
export default async function token(req, res) {
  const {
    session: sessionOptions,
    jwt,
    cookies,
    provider,
    logger,
  } = req.options

  const token = req.cookies[cookies.sessionToken.name]

  if (!token) {
    return res.json({ access_token: null })
  }

  if (sessionOptions.jwt) {
    const session = await jwt.decode({ ...jwt, token })

    if (!session.tokens) {
      logger.warn(
        "You must save `tokens` in your session cookie. Check out the JWT callback"
      )
      return res.json({ access_token: null })
    }

    // Refresh if provider supports refresh_token.
    // We update 1 minute before the token expires to have some room
    if (
      session.tokens.refresh_token &&
      session.tokens.expires - 60_000 < Date.now()
    ) {
      const newTokens = await refreshTokens(session.tokens, provider)
      logger.debug("Succesfully refreshed tokens", newTokens)
      session.tokens = { ...session.tokens, ...newTokens }
    }

    // Generate new session expiry date
    const sessionExpiresMs = Date.now() + sessionOptions.maxAge * 1000
    const newEncodedJwt = await jwt.encode({ ...jwt, token: session })
    const expires = new Date(sessionExpiresMs).toISOString()

    // Update cookie with new tokens and new expiry time
    cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
      expires,
      ...cookies.sessionToken.options,
    })

    return res.json({
      access_token: session.tokens.access_token,
    })
  }

  return res
    .status(501)
    .json({ error: "Token endpoint currently only supports JWT sessions." })
}
