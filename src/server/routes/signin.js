import getAuthorizationUrl from "../lib/oauth/authorization-url"
import emailSignin from "../lib/email/signin"

/**
 * Handle requests to /api/auth/signin
 * @param {{
 *   options: import("src/lib/types").InternalOptions
 *   query: import("src/server").IncomingRequest["query"]
 *   body: import("src/server").IncomingRequest["body"]
 * }}
 * @return {import("src/server").OutgoingResponse}
 */
export default async function signin({ options, query, body }) {
  const { base, adapter, callbacks, logger } = options

  /** @type {import("src/providers").OAuthConfig | import("src/providers").EmailConfig} */
  const provider = options.provider

  if (!provider.type) {
    return {
      status: 500,
      text: `Error: Type not specified for ${provider.name}`,
    }
  }

  if (provider.type === "oauth") {
    try {
      return await getAuthorizationUrl({ options, query })
    } catch (error) {
      logger.error("SIGNIN_OAUTH_ERROR", { error, provider })
      return { redirect: `${base}/error?error=OAuthSignin` }
    }
  } else if (provider.type === "email") {
    if (!adapter) {
      logger.error(
        "EMAIL_REQUIRES_ADAPTER_ERROR",
        new Error("E-mail login requires an adapter but it was undefined")
      )
      return { redirect: `${base}/error?error=Configuration` }
    }

    // Note: Technically the part of the email address local mailbox element
    // (everything before the @ symbol) should be treated as 'case sensitive'
    // according to RFC 2821, but in practice this causes more problems than
    // it solves. We treat email addresses as all lower case. If anyone
    // complains about this we can make strict RFC 2821 compliance an option.
    const email = body.email?.toLowerCase() ?? null

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
        return { redirect: `${base}/error?error=AccessDenied` }
      } else if (typeof signInCallbackResponse === "string") {
        return { redirect: signInCallbackResponse }
      }
    } catch (error) {
      return { redirect: `${base}/error?${new URLSearchParams({ error })}}` }
    }

    try {
      await emailSignin(email, options)
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", error)
      return { redirect: `${base}/error?error=EmailSignin` }
    }

    const params = new URLSearchParams({
      provider: provider.id,
      type: provider.type,
    })
    const url = `${base}/verify-request?${params}`
    return { redirect: url }
  }
  return { redirect: `${base}/signin` }
}
