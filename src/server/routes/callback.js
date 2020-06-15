// Handle callbacks from login services
import oAuthCallback from '../lib/oauth/callback'
import callbackHandler from '../lib/callback-handler'
import cookie from '../lib/cookie'
import logger from '../../lib/logger'
import dispatchEvent from '../lib/dispatch-event'

export default async (req, res, options, done) => {
  const {
    provider: providerName,
    providers,
    adapter,
    site,
    secret,
    baseUrl,
    cookies,
    callbackUrl,
    pages,
    jwt,
    events,
    callbacks
  } = options
  const provider = providers[providerName]
  const { type } = provider
  const useJwtSession = options.session.jwt
  const sessionMaxAge = options.session.maxAge

  // Get session ID (if set)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (type === 'oauth') {
    oAuthCallback(req, provider, async (error, oauthAccount) => {
      if (error) {
        logger.error('CALLBACK_OAUTH_ERROR', error)
        res.status(302).setHeader('Location', `${baseUrl}/error?error=oAuthCallback`)
        res.end()
        return done()
      }
      try {
        const { profile, account, oAuthProfile } = await oauthAccount

        // Check if user is allowed to sign in
        const signinCallbackResponse = await callbacks.signin(profile, account, oAuthProfile)

        if (signinCallbackResponse === false) {
          res.status(302).setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
          res.end()
          return done()
        }

        // Sign user in
        const { user, session, isNewUser } = await callbackHandler(sessionToken, profile, account, options)

        if (useJwtSession) {
          const defaultJwtPayload = { user, account, isNewUser }
          const jwtPayload = await callbacks.jwt(defaultJwtPayload, oAuthProfile)

          // Sign and encrypt token
          const newEncodedJwt = await jwt.encode({ secret: jwt.secret, token: jwtPayload, maxAge: sessionMaxAge })

          // Set cookie expiry date
          const cookieExpires = new Date()
          cookieExpires.setTime(cookieExpires.getTime() + (sessionMaxAge * 1000))

          cookie.set(res, cookies.sessionToken.name, newEncodedJwt, { expires: cookieExpires.toISOString(), ...cookies.sessionToken.options })
        } else {
          // Save Session Token in cookie
          cookie.set(res, cookies.sessionToken.name, session.sessionToken, { expires: session.expires || null, ...cookies.sessionToken.options })
        }

        await dispatchEvent(events.signin, { user, account, isNewUser })

        // Handle first logins on new accounts
        // e.g. option to send users to a new account landing page on initial login
        // Note that the callback URL is preserved, so the journey can still be resumed
        if (isNewUser && pages.newUser) {
          res.status(302).setHeader('Location', pages.newUser)
          res.end()
          return done()
        }
      } catch (error) {
        if (error.name === 'AccountNotLinkedError') {
          // If the email on the account is already linked, but nto with this oAuth account
          res.status(302).setHeader('Location', `${baseUrl}/error?error=OAuthAccountNotLinked`)
        } else if (error.name === 'CreateUserError') {
          res.status(302).setHeader('Location', `${baseUrl}/error?error=OAuthCreateAccount`)
        } else {
          logger.error('OAUTH_CALLBACK_HANDLER_ERROR', error)
          res.status(302).setHeader('Location', `${baseUrl}/error?error=Callback`)
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
      if (!adapter) {
        logger.error('EMAIL_REQUIRES_ADAPTER_ERROR')
        res.status(302).setHeader('Location', `${baseUrl}/error?error=Configuration`)
        res.end()
        return done()
      }

      const { getVerificationRequest, deleteVerificationRequest, getUserByEmail } = await adapter.getAdapter(options)
      const verificationToken = req.query.token
      const email = req.query.email

      // Verify email and verification token exist in database
      const invite = await getVerificationRequest(email, verificationToken, secret, provider)
      if (!invite) {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=Verification`)
        res.end()
        return done()
      }

      // If verification token is valid, delete verification request token from
      // the database so it cannot be used again
      await deleteVerificationRequest(email, verificationToken, secret, provider)

      // If is an existing user return a user object (otherwise use placeholder)
      const profile = await getUserByEmail(email) || { email }
      const account = { id: provider.id, type: 'email', providerAccountId: email }

      // Check if user is allowed to sign in
      const signinCallbackResponse = await callbacks.signin(profile, account, null)

      if (signinCallbackResponse === false) {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
        res.end()
        return done()
      }

      // Sign user in
      const { user, session, isNewUser } = await callbackHandler(sessionToken, profile, account, options)

      if (useJwtSession) {
        const defaultJwtPayload = { user, account, isNewUser }
        const jwtPayload = await callbacks.jwt(defaultJwtPayload)

        // Sign and encrypt token
        const newEncodedJwt = await jwt.encode({ secret: jwt.secret, token: jwtPayload, maxAge: sessionMaxAge })

        // Set cookie expiry date
        const cookieExpires = new Date()
        cookieExpires.setTime(cookieExpires.getTime() + (sessionMaxAge * 1000))

        cookie.set(res, cookies.sessionToken.name, newEncodedJwt, { expires: cookieExpires.toISOString(), ...cookies.sessionToken.options })
      } else {
        // Save Session Token in cookie
        cookie.set(res, cookies.sessionToken.name, session.sessionToken, { expires: session.expires || null, ...cookies.sessionToken.options })
      }

      await dispatchEvent(events.signin, { user, account, isNewUser })

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        res.status(302).setHeader('Location', pages.newUser)
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
        res.status(302).setHeader('Location', `${baseUrl}/error?error=EmailCreateAccount`)
      } else {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=Callback`)
        logger.error('CALLBACK_EMAIL_ERROR', error)
      }
      res.end()
      return done()
    }
  } else if (type === 'credentials' && req.method === 'POST') {
    if (!useJwtSession) {
      logger.error('CALLBACK_CREDENTIALS_JWT_ERROR', 'Signin in with credentials is only supported if JSON Web Tokens are enabled')
      res.status(302).setHeader('Location', `${baseUrl}/error?error=Configuration`)
      res.end()
      return done()
    }

    if (!provider.authorize) {
      logger.error('CALLBACK_CREDENTIALS_HANDLER_ERROR', 'Must define an authorize() handler to use credentials authentication provider')
      res.status(302).setHeader('Location', `${baseUrl}/error?error=Configuration`)
      res.end()
      return done()
    }

    const credentials = req.body
    const user = await provider.authorize(credentials)
    const account = { id: provider.id, type: 'credentials' }

    if (user === false) {
      res.status(302).setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
      res.end()
      return done()
    }

    const signinCallbackResponse = await callbacks.signin(user, account, credentials)

    if (signinCallbackResponse === false) {
      res.status(302).setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
      res.end()
      return done()
    }

    const defaultJwtPayload = { user, account }
    const jwtPayload = await callbacks.jwt(defaultJwtPayload)

    // Sign and encrypt token
    const newEncodedJwt = await jwt.encode({ secret: jwt.secret, token: jwtPayload, maxAge: sessionMaxAge })

    // Set cookie expiry date
    const cookieExpires = new Date()
    cookieExpires.setTime(cookieExpires.getTime() + (sessionMaxAge * 1000))

    cookie.set(res, cookies.sessionToken.name, newEncodedJwt, { expires: cookieExpires.toISOString(), ...cookies.sessionToken.options })

    await dispatchEvent(events.signin, { user, account })

    if (callbackUrl) {
      res.status(302).setHeader('Location', callbackUrl)
      res.end()
    } else {
      res.status(302).setHeader('Location', site)
      res.end()
    }

    return done()
  } else {
    res.status(500).end(`Error: Callback for provider type ${type} not supported`)
    return done()
  }
}
