// Handle requests to /api/auth/signin
import oAuthSignin from '../lib/oauth/signin'
import emailSignin from '../lib/email/signin'

export default (req, res, options, done) => {
  const { provider, providers, urlPrefix, csrfTokenVerified } = options
  const providerConfig = providers[provider]
  const { type } = providerConfig

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }

  if (type === 'oauth' || type === 'oauth2') {
    oAuthSignin(providerConfig, (error, oAuthSigninUrl) => {
      // @TODO Handle error
      if (error) {
        console.error('OAUTH_SIGNIN_ERROR', error)
      }

      res.setHeader('Location', oAuthSigninUrl)
      res.status(302).end()
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
      return done()
    }

    // @TODO Generate email invitation
    // await emailSignin(email, options, providerConfig)

    res.status(302).setHeader('Location', `${urlPrefix}/check-email`)
  } else {
    res.status(500).end(`Error: Provider type ${type} not supported`)
    console.error('PROVIDER_SIGNIN_ERROR', provider, type)
    return done()
  }
}
