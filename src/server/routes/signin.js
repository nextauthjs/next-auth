// Handle requests to /api/auth/signin
import oAuthSignin from '../lib/signin/oauth'
import emailSignin from '../lib/signin/email'
import logger from '../../lib/consoleErr'

export default async (req, res, options, done) => {
  const {
    provider: providerName,
    providers,
    baseUrl,
    csrfTokenVerified,
    adapter,
    allowSignin
  } = options
  const provider = providers[providerName]
  const { type } = provider

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }

  if (type === 'oauth') {
    oAuthSignin(provider, (error, oAuthSigninUrl) => {
      if (error) {
        logger.error('OAUTH_SIGNIN_ERROR', error)
        res
          .status(302)
          .setHeader('Location', `${baseUrl}/error?error=oAuthSignin`)
        res.end()
        return done()
      }

      res.status(302).setHeader('Location', oAuthSigninUrl)
      res.end()
      return done()
    })
  } else if (type === 'email' && req.method === 'POST') {
    if (!adapter) {
      logger.error('EMAIL_REQUIRES_ADAPTER_ERROR')
      res
        .status(302)
        .setHeader('Location', `${baseUrl}/error?error=Configuration`)
      res.end()
      return done()
    }

    // This works like oAuth signin but instead of returning a secure link
    // to the browser, it sends it via email to verify the user and then
    // redirects the browser to a page telling the user to follow the link
    // in their email.
    //
    // The link in the email will take them back to the callback page, where
    // it will be verified and, if valid, the user will be logged in; a new
    // account is created for them if they don't have one already.
    const email = req.body.email ? req.body.email.toLowerCase() : null

    // Check allowSignin() allows this account to sign in
    if (!(await allowSignin({ email }, { id: provider.id, type: 'email' }))) {
      res
        .status(302)
        .setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
      res.end()
      return done()
    }

    // If CSRF token not verified, send the user to sign in page, which will
    // display a new form with a valid token so that submitting it should work.
    //
    // Note: Adds ?csrf=true query string param to URL for debugging/tracking
    if (!csrfTokenVerified) {
      res
        .status(302)
        .setHeader(
          'Location',
          `${baseUrl}/signin?email=${encodeURIComponent(email)}&csrf=true`
        )
      res.end()
      return done()
    }

    try {
      await emailSignin(email, provider, options)
    } catch (error) {
      logger.error('EMAIL_SIGNIN_ERROR', error)
      res
        .status(302)
        .setHeader('Location', `${baseUrl}/error?error=EmailSignin`)
      res.end()
      return done()
    }

    res
      .status(302)
      .setHeader(
        'Location',
        `${baseUrl}/verify-request?provider=${encodeURIComponent(
          provider.id
        )}&type=${encodeURIComponent(provider.type)}`
      )
    res.end()
    return done()
  } else {
    // If provider not supported, redirect to sign in page
    res.status(302).setHeader('Location', `${baseUrl}/signin`)
    res.end()
    return done()
  }
}
