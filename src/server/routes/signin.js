import getAuthorizationUrl from "../lib/oauth/authorization-url"
import emailSignin from "../lib/email/signin"

/**
 * Handle requests to /api/auth/signin
 * @type {import("src/lib/types").NextAuthApiHandler}
 */
export default async function signin(req, res) {
  const { baseUrl, basePath, adapter, callbacks, logger } = req.options

  /** @type {import("src/providers").OAuthConfig | import("src/providers").EmailConfig} */
  const provider = req.options.provider

  if (!provider.type) {
    return res.status(500).end(`Error: Type not specified for ${provider.name}`)
  }

  if (provider.type === "oauth") {
    try {
      const authorizationUrl = await getAuthorizationUrl(req, res)
      return res.redirect(authorizationUrl)
    } catch (error) {
      logger.error("SIGNIN_OAUTH_ERROR", { error, provider })
      return res.redirect(`${baseUrl}${basePath}/error?error=OAuthSignin`)
    }
  } else if (provider.type === "email") {
    if (!adapter) {
      logger.error(
        "EMAIL_REQUIRES_ADAPTER_ERROR",
        new Error("E-mail login requires an adapter but it was undefined")
      )
      return res.redirect(`${baseUrl}${basePath}/error?error=Configuration`)
    }

    // Note: Technically the part of the email address local mailbox element
    // (everything before the @ symbol) should be treated as 'case sensitive'
    // according to RFC 2821, but in practice this causes more problems than
    // it solves. We treat email addresses as all lower case. If anyone
    // complains about this we can make strict RFC 2821 compliance an option.
    const email = req.body.email?.toLowerCase() ?? null

    const { getUserByEmail } = adapter
    // If is an existing user return a user object (otherwise use placeholder)
    const user = (email ? await getUserByEmail(email) : null) ?? { email }

    /** @type {import("src").Account} */
    const account = {
      providerAccountId: user.email,
      type: "email",
      provider: provider.id,
    }

    // Check if user is allowed to sign in
    try {
      const signInCallbackResponse = await callbacks.signIn({
        user,
        account,
        email: { verificationRequest: true },
      })
      if (!signInCallbackResponse) {
        return res.redirect(`${baseUrl}${basePath}/error?error=AccessDenied`)
      } else if (typeof signInCallbackResponse === "string") {
        return res.redirect(signInCallbackResponse)
      }
    } catch (error) {
      return res.redirect(
        `${baseUrl}${basePath}/error?${new URLSearchParams({ error })}}`
      )
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
