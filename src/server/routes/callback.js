// Handle callbacks from login services
import { oAuthCallback } from '../lib/oauth/callback'
import signinHandler from '../lib/signin-handler'
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const { provider, providers, adapter, site, urlPrefix, cookies, callbackUrl, newAccountLandingPageUrl } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  // Get session ID (if set)
  const sessionId = req.cookies[cookies.sessionId.name]

  const _callback = async (error, response) => {
    // @TODO Check error
    if (error) {
      console.log('SIGNIN_CALLBACK_ERROR', error)
    }

    const { profile, account } = response

    try {
      const {
        session,
        isNewAccount
      } = await signinHandler(
        adapter,
        sessionId,
        profile,
        account
      )

      // Save Session ID in cookie (HTTP Only cookie)
      cookie.set(res, cookies.sessionId.name, session.id, cookies.sessionId.options)

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewAccount && newAccountLandingPageUrl) {
        res.status(302).setHeader('Location', newAccountLandingPageUrl)
        res.end()
        return done()
      }
    } catch(error) {
      // @TODO Handle signin flow errors
      console.error(error)
    }

    // Callback URL is already verified at this point, so safe to use if specified
    if (callbackUrl) {
      res.status(302).setHeader('Location', callbackUrl)
      res.end()  
    } else {
      res.status(302).setHeader('Location', site)
      res.end()  
    }
    return done()
  }

  if (type === 'oauth' || type === 'oauth2') {
    oAuthCallback(req, providerConfig, _callback)
  } else {
    res.status(500).end(`Error: Callback for provider type ${type} not supported`)
    return done()
  }
}