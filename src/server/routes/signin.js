// Handle requests to /api/auth/signin
import oAuthSignin from '../lib/signin/oauth'
import emailSignin from '../lib/signin/email'
import logger from '../../lib/logger'

export default async (req, res, options, done) => {
  const { provider: providerName, providers, baseUrl, adapter, callbacks, csrfToken } = options
  const provider = providers[providerName]
  const { type } = provider
  const reponseAsJson = !!((req.body && req.body.json === 'true'))

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return done()
  }

  if (type === 'oauth' && req.method === 'POST') {
    oAuthSignin(provider, csrfToken, (error, oAuthSigninUrl) => {
      if (error) {
        logger.error('SIGNIN_OAUTH_ERROR', error)
        if (reponseAsJson) {
          res.json({ url: `${baseUrl}/error?error=oAuthSignin` })
        } else {
          res.status(302).setHeader('Location', `${baseUrl}/error?error=oAuthSignin`)
          res.end()
        }
        return done()
      }

      if (reponseAsJson) {
        res.json({ url: oAuthSigninUrl, foobar: '1' })
      } else {
        res.status(302).setHeader('Location', oAuthSigninUrl)
        res.end()
      }
      return done()
    })
  } else if (type === 'email' && req.method === 'POST') {
    if (!adapter) {
      logger.error('EMAIL_REQUIRES_ADAPTER_ERROR')
      if (reponseAsJson) {
        res.json({ url: `${baseUrl}/error?error=Configuration` })
      } else {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=Configuration`)
        res.end()
      }
      return done()
    }
    const { getUserByEmail } = await adapter.getAdapter(options)

    // Note: Technically the part of the email address local mailbox element
    // (everything before the @ symbol) should be treated as 'case sensitive'
    // according to RFC 2821, but in practice this causes more problems than
    // it solves. We treat email addresses as all lower case. If anyone
    // complains about this we can make strict RFC 2821 compliance an option.
    const email = req.body.email ? req.body.email.toLowerCase() : null

    // If is an existing user return a user object (otherwise use placeholder)
    const profile = await getUserByEmail(email) || { email }
    const account = { id: provider.id, type: 'email', providerAccountId: email }

    // Check if user is allowed to sign in
    const signinCallbackResponse = await callbacks.signin(profile, account)

    if (signinCallbackResponse === false) {
      res.status(302).setHeader('Location', `${baseUrl}/error?error=AccessDenied`)
      res.end()
      return done()
    }

    try {
      await emailSignin(email, provider, options)
    } catch (error) {
      logger.error('SIGNIN_EMAIL_ERROR', error)
      if (reponseAsJson) {
        res.json({ url: `${baseUrl}/error?error=EmailSignin` })
      } else {
        res.status(302).setHeader('Location', `${baseUrl}/error?error=EmailSignin`)
        res.end()
      }
      return done()
    }

    if (reponseAsJson) {
      res.json({
        url: `${baseUrl}/verify-request?provider=${encodeURIComponent(
        provider.id
      )}&type=${encodeURIComponent(provider.type)}`
      })
    } else {
      res.status(302).setHeader(
        'Location',
          `${baseUrl}/verify-request?provider=${encodeURIComponent(
            provider.id
          )}&type=${encodeURIComponent(provider.type)}`
      )
      res.end()
    }
    return done()
  } else {
    if (reponseAsJson) {
      res.json({ url: `${baseUrl}/signin` })
    } else {
      // If provider not supported, redirect to sign in page
      res.status(302).setHeader('Location', `${baseUrl}/signin`)
      res.end()
    }
    return done()
  }
}
