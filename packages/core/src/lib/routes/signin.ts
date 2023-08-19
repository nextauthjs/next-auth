import tokenSignin from "../token/signin.js"
import { SignInError } from "../../errors.js"
import { getAuthorizationUrl } from "../oauth/authorization-url.js"
import { handleAuthorized } from "./shared.js"

import type {
  Account,
  InternalOptions,
  RequestInternal,
  ResponseInternal,
} from "../../types.js"

/**
 * Initiates the sign in process for OAuth and Email flows .
 * For OAuth, redirects to the provider's authorization URL.
 * For Email, sends an email with a sign in link.
 */
export async function signin(
  request: RequestInternal,
  options: InternalOptions<"oauth" | "oidc" | "token">
): Promise<ResponseInternal> {
  const { query, body } = request
  const { url, logger, provider } = options
  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      return await getAuthorizationUrl(query, options)
    } else if (provider.type === "token") {
      const tokenId = provider.normalizeIdentifier?.(body?.tokenId) ?? ""

      const user = (await options.adapter!.getUserByTokenId(tokenId)) ?? {
        id: tokenId,
        email: tokenId,
        tokenId,
        tokenVerified: null,
        emailVerified: null,
      }

      const account: Account = {
        providerAccountId: tokenId,
        userId: user.id,
        type: "token",
        provider: provider.id,
      }

      const unauthorizedOrError = await handleAuthorized(
        { user, account, email: { verificationRequest: true } },
        options
      )

      if (unauthorizedOrError) return unauthorizedOrError

      const redirect = await tokenSignin(tokenId, options, request)
      return { redirect }
    }
    return { redirect: `${url}/signin` }
  } catch (e) {
    const error = new SignInError(e as Error, { provider: provider.id })
    logger.error(error)
    const code = provider.type === "token" ? "TokenSignin" : "OAuthSignin"
    url.searchParams.set("error", code)
    url.pathname += "/signin"
    return { redirect: url.toString() }
  }
}
