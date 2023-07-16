import getAuthorizationUrl from "../lib/oauth/authorization-url"
import emailSignin from "../lib/email/signin"
import getAdapterUserFromEmail from "../lib/email/getUserFromEmail"
import type { RequestInternal, ResponseInternal } from ".."
import type { InternalOptions } from "../types"
import type { Account } from "../.."

/** Handle requests to /api/auth/signin */
export default async function signin(params: {
  options: InternalOptions<"oauth" | "email">
  query: RequestInternal["query"]
  body: RequestInternal["body"]
}): Promise<ResponseInternal> {
  const { options, query, body } = params
  const { url, callbacks, logger, provider } = options

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
      logger.error("SIGNIN_OAUTH_ERROR", {
        error: error as Error,
        providerId: provider.id,
      })
      return { redirect: `${url}/error?error=OAuthSignin` }
    }
  } else if (provider.type === "email") {
    let email: string = body?.email
    if (!email) return { redirect: `${url}/error?error=EmailSignin` }
    const normalizer: (identifier: string) => string =
      provider.normalizeIdentifier ??
      ((identifier) => {
        // Get the first two elements only,
        // separated by `@` from user input.
        let [local, domain] = identifier.toLowerCase().trim().split("@")
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        domain = domain.split(",")[0]
        return `${local}@${domain}`
      })

    try {
      email = normalizer(body?.email)
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", { error, providerId: provider.id })
      return { redirect: `${url}/error?error=EmailSignin` }
    }

    const user = await getAdapterUserFromEmail({
      email,
      adapter: options.adapter,
    })

    const account: Account = {
      providerAccountId: email,
      userId: email,
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
        return { redirect: `${url}/error?error=AccessDenied` }
      } else if (typeof signInCallbackResponse === "string") {
        return { redirect: signInCallbackResponse }
      }
    } catch (error) {
      return {
        redirect: `${url}/error?${new URLSearchParams({
          error: error as string,
        })}`,
      }
    }

    try {
      const redirect = await emailSignin(email, options)
      return { redirect }
    } catch (error) {
      logger.error("SIGNIN_EMAIL_ERROR", { error, providerId: provider.id })
      return { redirect: `${url}/error?error=EmailSignin` }
    }
  }
  return { redirect: `${url}/signin` }
}
