// Handle callbacks from login services
import OAuthCallback from '../lib/oauth/callback'
import callbackHandler from '../lib/callback-handler'
import cookie from '../lib/cookie'

// @TODO Refactor OAuthCallback to return promise instead of using a callback and reduce duplicate code
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
    jwt
  } = options
  const provider = providers[providerName]
  const { type } = provider
  const { getVerificationRequest, deleteVerificationRequest } = await adapter.getAdapter(options)
  const useJwtSession = options.session.jwt
  const sessionMaxAge = options.session.maxAge

  // Get session ID (if set)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (type === 'oauth') {
    OAuthCallback(req, provider, async (error, oauthAccount) => {
      if (error) {
        console.error('OAUTH_CALLBACK_ERROR', error)
        res.status(302).setHeader('Location', `${baseUrl}/error?error=OAuthCallback`)
        res.end()
        return done()
      }

      const { profile, account } = await oauthAccount

      try {
        const { user, session, isNewUser } = await callbackHandler(sessionToken, profile, account, options)

        if (useJwtSession) {
          const jwtPayload = await jwt.set({
            user,
            account,
            isNewUser
          })

          // Sign and encrypt token
          const token = await jwt.encode({ secret: jwt.secret, token: jwtPayload, maxAge: sessionMaxAge })

          // Set cookie expiry date
          const cookieExpires = new Date()
          cookieExpires.setTime(cookieExpires.getTime() + (sessionMaxAge * 1000))

          cookie.set(res, cookies.sessionToken.name, token, { expires: cookieExpires.toISOString(), ...cookies.sessionToken.options })
        } else {
          // Save Session Token in cookie
          cookie.set(res, cookies.sessionToken.name, session.sessionToken, { expires: session.sessionExpires || null, ...cookies.sessionToken.options })
        }

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
          res.status(302).setHeader('Location', `${baseUrl}/error?error=oAuthAccountNotLinked`)
        } else if (error.name === 'CreateUserError') {
          res.status(302).setHeader('Location', `${baseUrl}/error?error=OAuthCreateAccount`)
        } else if (error.name === 'InvalidProfile') {
          // If is missing email address (NB: the only field on a profile currently required)
          res.status(302).setHeader('Location', `${baseUrl}/error?error=EmailRequired`)
        } else {
          console.error('OAUTH_CALLBACK_HANDLER_ERROR', error)
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
      const token = req.query.token
      const email = req.query.email ? req.query.email.toLowerCase() : null

      // Verify email and token match email verification record in database
      const invite = await getVerificationRequest(email, token, secret, provider)
      if (!invite) {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=Verification`)
        res.end()
        return done()
      }

      // If token is valid, delete email verification record in database
      await deleteVerificationRequest(email, token, secret, provider)

      // Create the an `account` object with `id` and `type` properties as they
      // are expected by the `callbackHandler` function and in the JWT.
      const emailProviderAccount = { id: provider.id, type: 'email' }

      // Invoke callbackHandler to go through sign up flow
      //
      // This will create new new account if they don't have one, or sign them
      // into an existing account if they do have one.
      const { user, session, isNewUser } = await callbackHandler(sessionToken, { email }, emailProviderAccount, options)

      if (useJwtSession) {
        const jwtPayload = await jwt.set({
          user,
          account: emailProviderAccount,
          isNewUser
        })

        // Sign and encrypt token
        const token = await jwt.encode({ secret: jwt.secret, token: jwtPayload, maxAge: sessionMaxAge })

        // Set cookie expiry date
        const cookieExpires = new Date()
        cookieExpires.setTime(cookieExpires.getTime() + (sessionMaxAge * 1000))

        cookie.set(res, cookies.sessionToken.name, token, { expires: cookieExpires.toISOString(), ...cookies.sessionToken.options })
      } else {
        // Save Session Token in cookie
        cookie.set(res, cookies.sessionToken.name, session.sessionToken, { expires: session.sessionExpires || null, ...cookies.sessionToken.options })
      }

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
