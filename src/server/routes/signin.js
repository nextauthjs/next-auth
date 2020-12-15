import oAuthSignin from '../lib/signin/oauth'
import emailSignin from '../lib/signin/email'
import logger from '../../lib/logger'
import baseUrl from '../../lib/baseUrl'

/** Handle requests to /api/auth/signin */
export default async function signin (req, res) {
  const {
    provider: providerName,
    providers,
    adapter,
    callbacks,
    csrfToken
  } = req.options
  const provider = providers[providerName]
  const { type } = provider

  if (!type) {
    res.status(500).end(`Error: Type not specified for ${provider}`)
    return res.end()
  }

  if (type === 'oauth' && req.method === 'POST') {
    const authParams = { ...req.query }
    delete authParams.nextauth // This is probably not intended to be sent to the provider, remove

    oAuthSignin(provider, csrfToken, (error, oAuthSigninUrl) => {
      if (error) {
        logger.error('SIGNIN_OAUTH_ERROR', error)
        return res.redirect(`${baseUrl()}/error?error=OAuthSignin`)
      }

      return res.redirect(oAuthSigninUrl)
    }, authParams)
  } else if (type === 'email' && req.method === 'POST') {
    if (!adapter) {
      logger.error('EMAIL_REQUIRES_ADAPTER_ERROR')
      return res.redirect(`${baseUrl()}/error?error=Configuration`)
    }
    const { getUserByEmail } = await adapter.getAdapter(req.options)

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
    try {
      const signinCallbackResponse = await callbacks.signIn(profile, account, { email, verificationRequest: true })
      if (signinCallbackResponse === false) {
        return res.redirect(`${baseUrl()}/error?error=AccessDenied`)
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(`${baseUrl()}/error?error=${encodeURIComponent(error)}`)
      } else {
        return res.redirect(error)
      }
    }

    try {
      await emailSignin(email, provider, req.options)
    } catch (error) {
      logger.error('SIGNIN_EMAIL_ERROR', error)
      return res.redirect(`${baseUrl()}/error?error=EmailSignin`)
    }

    return res.redirect(`${baseUrl()}/verify-request?provider=${encodeURIComponent(
      provider.id
    )}&type=${encodeURIComponent(provider.type)}`)
  } else {
    return res.redirect(`${baseUrl()}/signin`)
  }
}
