// Handle requests to /api/auth/signin
import oAuthSignin from '../lib/signin/oauth'
import emailSignin from '../lib/signin/email'

export default async (req, res, options, done) => {
  const { provider: providerName, providers, urlPrefix, csrfTokenVerified } = options
  const provider = providers[providerName]
  const { type } = provider

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }

  if (type === 'oauth' || type === 'oauth2') {
    oAuthSignin(provider, (error, oAuthSigninUrl) => {
      // @TODO Handle error
      if (error) {
        console.error('OAUTH_SIGNIN_ERROR', error)
      }

      res.status(302).setHeader('Location', oAuthSigninUrl)
      res.end()
      return done()
    })
  } else if (type === 'email' && req.method === 'POST') {
    // This works like oAuth signin but instead of returning a secure link
    // to the browser, it sends it via email to verify the user and then
    // redirects the browser to a page telling the user to follow the link
    // in their email. The link in the email will take them back to the
    // callback page, where it it will be verified and, if valid, the
    // user logged in (and a new account created for them, if they don't
    // have one already.)
    const { email } = req.body

    // If CSRF token not verified, send the user to sign in page, which will
    // display a new form with a valid token so that submitting it should work.
    //
    // Note: Adds ?csrf=true query string param to URL for debugging/tracking
    // and email param so that they don't have to enter their email address again.
    // @TODO Add support for custom signin URLs
    if (!csrfTokenVerified) {
      res.status(302).setHeader('Location', `${urlPrefix}/signin?email=${email}&csrf=true`)
      res.end()
      return done()
    }

    // If 'async' is not set (or is not set to 'true') then making a blocking call to send
    // email before returning a response to the user.
    if (Object.prototype.hasOwnProperty.call(provider, 'async') && provider.async !== true) {
      try {
        await emailSignin(email, provider, options)
      } catch (error) {
        // Log error so can take action
        console.error('EMAIL_SIGNIN_ERROR', error)
        // Return error to user
        res.status(302).setHeader('Location', `${urlPrefix}/error?error=EmailSignin`)
        res.end()
        return done()
      }
    }

    res.status(302).setHeader('Location', `${urlPrefix}/check-email`)
    res.end()

    if (!Object.prototype.hasOwnProperty.call(provider, 'async') || provider.async === true) {
      try {
        await emailSignin(email, provider, options)
      } catch (error) {
        // Log error, but do nothing else (to late to return to user!)
        console.error('EMAIL_SIGNIN_ERROR', error)
      }
    }

    // When email sent, we are actually done.
    return done()
  } else {
    // If provider not supported, redirect to sign in page
    res.status(302).setHeader('Location', `${urlPrefix}/signin`)
    res.end()
    return done()
  }
}
