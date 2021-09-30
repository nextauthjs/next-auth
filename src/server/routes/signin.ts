import getAuthorizationUrl from "../lib/oauth/authorization-url"
import emailSignin from "../lib/email/signin"
import { IncomingRequest, OutgoingResponse } from ".."
import { InternalOptions } from "../../lib/types"
import { Account, User } from "../.."

/** Handle requests to /api/auth/signin */
export default async function signin(params: {
  options: InternalOptions<"oauth" | "email">
  query: IncomingRequest["query"]
  body: IncomingRequest["body"]
}): Promise<OutgoingResponse> {
  const { options, query, body } = params
  const { url, adapter, callbacks, logger, provider } = options

  if (!provider.type) {
    return {
      status: 500,
      // @ts-expect-error
      text: `Error: Type not specified for ${provider.name}`,
    }
  }

  if (provider.type === "oauth") {
    try {
      const response = await getAuthorizationUrl({ options, query })
      return response
    } catch (error) {
      logger.error("SIGNIN_OAUTH_ERROR", { error, provider })
      return { redirect: `${url}/error?error=OAuthSignin` }
    }
  } else if (provider.type === "email") {
    if (!adapter) {
      logger.error(
        "EMAIL_REQUIRES_ADAPTER_ERROR",
        new Error("E-mail login requires an adapter but it was undefined")
      )
      return { redirect: `${url}/error?error=Configuration` }
    }

    // Note: Technically the part of the email address local mailbox element
    // (everything before the @ symbol) should be treated as 'case sensitive'
    // according to RFC 2821, but in practice this causes more problems than
    // it solves. We treat email addresses as all lower case. If anyone
    // complains about this we can make strict RFC 2821 compliance an option.
    const email = body?.email?.toLowerCase() ?? null

    const { getUserByEmail } = adapter
    // If is an existing user return a user object (otherwise use placeholder)
    const user: User = (email ? await getUserByEmail(email) : null) ?? {
      email,
      id: email,
    }

    const account: Account = {
      providerAccountId: email,
      userId: email,
      type: "email",
      provider: provider.id,
    }

    // Check if user is allowed to sign in
    try {
      // @ts-expect-error
      const signInCallbackResponse = await callbacks.signIn({
        user,
        account,
        email: { verificationRequest: true },
      })
      if (!signInCallbackResponse) {
        return { redirect: `${url}/error?error=AccessDenied` }
      } else if (typeof signInCallbackResponse === "string") {
        return { redirect: signInCallbackResponse }
      }
    } catch (error) {
      return { redirect: `${url}/error?${new URLSearchParams({ error })}}` }
    }

    try {
      await emailSignin(email, options)
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", error)
      return { redirect: `${url}/error?error=EmailSignin` }
    }

    const params = new URLSearchParams({
      provider: provider.id,
      type: provider.type,
    })

    return { redirect: `${url}/verify-request?${params}` }
  }
  return { redirect: `${url}/signin` }
}
