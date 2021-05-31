import getAuthorizationUrl from "../lib/signin/oauth"
import emailSignin from "../lib/signin/email"
import adapterErrorHandler from "../../adapters/error-handler"

/**
 * Handle requests to /api/auth/signin
 * @param {import("types/internals").NextAuthRequest} req
 * @param {import("types/internals").NextAuthResponse} res
 */
export default async function signin(req, res) {
  const {
    provider,
    baseUrl,
    basePath,
    adapter,
    callbacks,
    logger,
  } = req.options

  if (!provider.type) {
    return res.status(500).end(`Error: Type not specified for ${provider.name}`)
  }

  if (provider.type === "oauth") {
    try {
      const authorizationUrl = await getAuthorizationUrl(req)
      return res.redirect(authorizationUrl)
    } catch (error) {
      logger.error("SIGNIN_OAUTH_ERROR", error)
      return res.redirect(`${baseUrl}${basePath}/error?error=OAuthSignin`)
    }
  } else if (provider.type === "email") {
    if (!adapter) {
      logger.error("EMAIL_REQUIRES_ADAPTER_ERROR")
      return res.redirect(`${baseUrl}${basePath}/error?error=Configuration`)
    }
    const { getUserByEmail } = adapterErrorHandler(
      await adapter.getAdapter(req.options),
      logger
    )

    // Note: Technically the part of the email address local mailbox element
    // (everything before the @ symbol) should be treated as 'case sensitive'
    // according to RFC 2821, but in practice this causes more problems than
    // it solves. We treat email addresses as all lower case. If anyone
    // complains about this we can make strict RFC 2821 compliance an option.
    const email = req.body.email.toLowerCase()

    // If is an existing user return a user object (otherwise use placeholder)
    const profile = (await getUserByEmail(email)) || { email }
    const account = { id: provider.id, type: "email", providerAccountId: email }

    // Check if user is allowed to sign in
    try {
      const signInCallbackResponse = await callbacks.signIn(profile, account, {
        email,
        verificationRequest: true,
      })
      if (signInCallbackResponse === false) {
        return res.redirect(`${baseUrl}${basePath}/error?error=AccessDenied`)
      } else if (typeof signInCallbackResponse === "string") {
        return res.redirect(signInCallbackResponse)
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(
          `${baseUrl}${basePath}/error?error=${encodeURIComponent(error)}`
        )
      }
      // TODO: Remove in a future major release
      logger.warn("SIGNIN_CALLBACK_REJECT_REDIRECT")
      return res.redirect(error)
    }

    try {
      await emailSignin(email, req.options)
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", error)
      return res.redirect(`${baseUrl}${basePath}/error?error=EmailSignin`)
    }

    const params = new URLSearchParams({
      provider: provider.id,
      type: provider.type,
    })
    const url = `${baseUrl}${basePath}/verify-request?${params}`
    return res.redirect(url)
  }
  return res.redirect(`${baseUrl}${basePath}/signin`)
}
