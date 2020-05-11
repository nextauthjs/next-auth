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

  const _oAuthCallback = async (error, response) => {
    // @TODO Check error
    if (error) {
      console.log('OAUTH_CALLBACK_ERROR', error)
    }

    const { profile, account } = response

    try {
      const { session, isNewAccount } = await signinHandler(
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
    } catch (error) {
      const errorPageUrl = `${urlPrefix}/error` // @TODO Allow error URL to be supplied as an option
      if (error.name === 'CreateUserError') {
        // @TODO Try to look up user by by email address and confirm it occured because they
        // the user already has an account with the same email, but signed in with another provider.
        // This is almost certainly the case, but this COULD happen for other reasons, such as
        // a problem with the database or custom adapter code.
        res.status(302).setHeader('Location', `${errorPageUrl}?error=Signin`)
      } else {
        res.status(302).setHeader('Location', `${errorPageUrl}?error=Unknown`)
        console.error('SIGNIN_CALLBACK_ERROR', error)
      }
      res.end()
      return done()
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
    oAuthCallback(req, providerConfig, _oAuthCallback)
  } else {
    res.status(500).end(`Error: Callback for provider type ${type} not supported`)
    return done()
  }
}
