// Handle callbacks from login services
import { oAuthCallback } from '../lib/oauth/callback'
import signinHandler from '../lib/signin-handler'
import cookie from '../lib/cookie'

// @TODO Refactor oAuthCallback to return promise instead of using a callback and reduce duplicate code
export default async (req, res, options, done) => {
  const { provider: providerName, providers, adapter, site, secret, urlPrefix, cookies, callbackUrl, newAccountLandingPageUrl } = options
  const provider = providers[providerName]
  const { type } = provider
  const _adapter = await adapter.getAdapter()
  const { getEmailVerification, deleteEmailVerification } = _adapter

  // @TODO Allow error URL to be supplied as an option
  const errorPageUrl = `${urlPrefix}/error`

  // Get session ID (if set)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (type === 'oauth' || type === 'oauth2') {
    oAuthCallback(req, provider, async (error, response) => {
      // @TODO Check error
      if (error) {
        console.error('OAUTH_CALLBACK_ERROR', error)
      }

      const { profile, account } = response

      try {
        const { session, isNewAccount } = await signinHandler(adapter, sessionToken, profile, account)

        // Save Session ID in cookie (HTTP Only cookie)
        cookie.set(res, cookies.sessionToken.name, session.sessionToken, cookies.sessionToken.options)

        // Handle first logins on new accounts
        // e.g. option to send users to a new account landing page on initial login
        // Note that the callback URL is preserved, so the journey can still be resumed
        if (isNewAccount && newAccountLandingPageUrl) {
          res.status(302).setHeader('Location', newAccountLandingPageUrl)
          res.end()
          return done()
        }
      } catch (error) {
        if (error.name === 'CreateUserError') {
          // @TODO Try to look up user by by email address and confirm it occured because they
          // the user already has an account with the same email, but signed in with another provider.
          // This is almost certainly the case, but this COULD happen for other reasons, such as
          // a problem with the database or custom adapter code.
          res.status(302).setHeader('Location', `${errorPageUrl}?error=Signin`)
        } else {
          res.status(302).setHeader('Location', `${errorPageUrl}?error=Unknown`)
          console.error('OAUTH_CALLBACK_ERROR', error)
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
    })
  } else if (type === 'email') {
    try {
      const { email, token } = req.query
      // Verify email and token match email verification record in database
      const invite = await getEmailVerification(email, token, secret, provider)
      if (!invite) {
        res.status(302).setHeader('Location', `${errorPageUrl}?error=Invite`)
        res.end()
        return done()
      }

      // If token valid, delete email verification record in database
      await deleteEmailVerification(email, token, secret, provider)

      // If token valid, sign them in
      const { session, isNewAccount } = await signinHandler(adapter, sessionToken, { email }, provider)

      // Save Session ID in cookie (HTTP Only cookie)
      cookie.set(res, cookies.sessionToken.name, session.sessionToken, cookies.sessionToken.options)

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewAccount && newAccountLandingPageUrl) {
        res.status(302).setHeader('Location', newAccountLandingPageUrl)
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
    } catch (error) {
      if (error.name === 'CreateUserError') {
        // @TODO Try to look up user by by email address and confirm it occured because they
        // the user already has an account with the same email, but signed in with another provider.
        // This is almost certainly the case, but this COULD happen for other reasons, such as
        // a problem with the database or custom adapter code.
        res.status(302).setHeader('Location', `${errorPageUrl}?error=Signin`)
      } else {
        res.status(302).setHeader('Location', `${errorPageUrl}?error=Unknown`)
        console.error('EMAIL_CALLBACK_ERROR', error)
      }
      res.end()
      return done()
    }
  } else {
    res.status(500).end(`Error: Callback for provider type ${type} not supported`)
    return done()
  }
}
