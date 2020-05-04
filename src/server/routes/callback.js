// Handle callbacks from login services
import { oAuthCallback } from '../lib/oauth/callback'
import signinFlow from '../lib/signin-flow'
import cookie from '../lib/cookie'

export default async (req, res, options, resolve) => {
  const {
    provider,
    providers,
    adapter,
    site,
    sessionIdCookieName,
    callbackUrlCookieName,
    cookieOptions
  } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  // Get session ID (if set)
  const sessionId = req.cookies[sessionIdCookieName]

  // Get callback URL from cookie (saved at the start of the signin flow)
  let callbackUrl = req.cookies[callbackUrlCookieName] || site

  const _callback = async (error, response) => {
    // @TODO Check error
    if (error) {
      console.log('SIGNIN_CALLBACK_ERROR', error)
    }

    const { profile, _profile } = response

    // @TODO Check if user email exists in db
    try {
      const {
        session,
        user,
        isNewAccount
        } = await signinFlow(
        adapter,
        sessionId,
        profile,
        providerConfig
      )

      // @TODO Save session cookie
      //cookie(res, sessionIdCookieName, session.id, cookieOptions)

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewAccount && options.newAccountLandingPageUrl)
        callbackUrl = options.newAccountLandingPageUrl
    } catch(error) {
      // @TODO Handle signin flow errors
    }

    // Check callbackUrl is at allowed domain
    if (!options.checkCallbackUrl || options.checkCallbackUrl(callbackUrl)) {
      res.statusCode = 302
      res.setHeader('Location', callbackUrl)
      res.end()
    } else {
      // If checkCallbackUrl function is defined but doesn't return true,
      // then redirect to the homepage
      console.warn(`Warning: URL '${callbackUrl}' is not an allowed callback URL (redirecting client to ${site})`)
      res.statusCode = 302
      res.setHeader('Location', site)
      res.end()
    }
    return resolve()
  }

  if (type === 'oauth' || type === 'oauth2') {
    oAuthCallback(req, providerConfig, _callback)
  } else {
    res.statusCode = 500
    res.end(`Error: Callback for provider type ${type} not supported`)
    return resolve()
  }
}