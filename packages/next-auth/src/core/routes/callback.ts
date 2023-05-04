import oAuthCallback from "../lib/oauth/callback"
import callbackHandler from "../lib/callback-handler"
import { hashToken } from "../lib/utils"
import getAdapterUserFromEmail from "../lib/email/getUserFromEmail"

import type { InternalOptions } from "../types"
import type { RequestInternal, ResponseInternal } from ".."
import type { Cookie, SessionStore } from "../lib/cookie"
import type { User } from "../.."
import type { AdapterSession } from "../../adapters"

/** Handle callbacks from login services */
export default async function callback(params: {
  options: InternalOptions
  query: RequestInternal["query"]
  method: Required<RequestInternal>["method"]
  body: RequestInternal["body"]
  headers: RequestInternal["headers"]
  cookies: RequestInternal["cookies"]
  sessionStore: SessionStore
}): Promise<ResponseInternal> {
  const { options, query, body, method, headers, sessionStore } = params
  const {
    provider,
    adapter,
    url,
    callbackUrl,
    pages,
    jwt,
    events,
    callbacks,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
    logger,
  } = options

  const cookies: Cookie[] = []

  const useJwtSession = sessionStrategy === "jwt"

  if (provider.type === "oauth") {
    try {
      const {
        profile,
        account,
        OAuthProfile,
        cookies: oauthCookies,
      } = await oAuthCallback({
        query,
        body,
        method,
        options,
        cookies: params.cookies,
      })

      if (oauthCookies.length) cookies.push(...oauthCookies)

      try {
        // Make it easier to debug when adding a new provider
        logger.debug("OAUTH_CALLBACK_RESPONSE", {
          profile,
          account,
          OAuthProfile,
        })

        // If we don't have a profile object then either something went wrong
        // or the user cancelled signing in. We don't know which, so we just
        // direct the user to the signin page for now. We could do something
        // else in future.
        //
        // Note: In oAuthCallback an error is logged with debug info, so it
        // should at least be visible to developers what happened if it is an
        // error with the provider.
        if (!profile || !account || !OAuthProfile) {
          return { redirect: `${url}/signin`, cookies }
        }

        // Check if user is allowed to sign in
        // Attempt to get Profile from OAuth provider details before invoking
        // signIn callback - but if no user object is returned, that is fine
        // (that just means it's a new user signing in for the first time).
        let userOrProfile = profile
        if (adapter) {
          const { getUserByAccount } = adapter
          const userByAccount = await getUserByAccount({
            providerAccountId: account.providerAccountId,
            provider: provider.id,
          })

          if (userByAccount) userOrProfile = userByAccount
        }

        try {
          const isAllowed = await callbacks.signIn({
            user: userOrProfile,
            account,
            profile: OAuthProfile,
          })
          if (!isAllowed) {
            return { redirect: `${url}/error?error=AccessDenied`, cookies }
          } else if (typeof isAllowed === "string") {
            return { redirect: isAllowed, cookies }
          }
        } catch (error) {
          return {
            redirect: `${url}/error?error=${encodeURIComponent(
              (error as Error).message
            )}`,
            cookies,
          }
        }

        // Sign user in
        const { user, session, isNewUser } = await callbackHandler({
          sessionToken: sessionStore.value,
          profile,
          account,
          options,
        })

        if (useJwtSession) {
          const defaultToken = {
            name: user.name,
            email: user.email,
            picture: user.image,
            sub: user.id?.toString(),
          }
          const token = await callbacks.jwt({
            token: defaultToken,
            user,
            account,
            profile: OAuthProfile,
            isNewUser,
            trigger: isNewUser ? "signUp" : "signIn",
          })

          // Encode token
          const newToken = await jwt.encode({ ...jwt, token })

          // Set cookie expiry date
          const cookieExpires = new Date()
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          })
          cookies.push(...sessionCookies)
        } else {
          // Save Session Token in cookie
          cookies.push({
            name: options.cookies.sessionToken.name,
            value: (session as AdapterSession).sessionToken,
            options: {
              ...options.cookies.sessionToken.options,
              expires: (session as AdapterSession).expires,
            },
          })
        }

        // @ts-expect-error
        await events.signIn?.({ user, account, profile, isNewUser })

        // Handle first logins on new accounts
        // e.g. option to send users to a new account landing page on initial login
        // Note that the callback URL is preserved, so the journey can still be resumed
        if (isNewUser && pages.newUser) {
          return {
            redirect: `${pages.newUser}${
              pages.newUser.includes("?") ? "&" : "?"
            }callbackUrl=${encodeURIComponent(callbackUrl)}`,
            cookies,
          }
        }

        // Callback URL is already verified at this point, so safe to use if specified
        return { redirect: callbackUrl, cookies }
      } catch (error) {
        if ((error as Error).name === "AccountNotLinkedError") {
          // If the email on the account is already linked, but not with this OAuth account
          return {
            redirect: `${url}/error?error=OAuthAccountNotLinked`,
            cookies,
          }
        } else if ((error as Error).name === "CreateUserError") {
          return { redirect: `${url}/error?error=OAuthCreateAccount`, cookies }
        }
        logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error as Error)
        return { redirect: `${url}/error?error=Callback`, cookies }
      }
    } catch (error) {
      if ((error as Error).name === "OAuthCallbackError") {
        logger.error("OAUTH_CALLBACK_ERROR", {
          error: error as Error,
          providerId: provider.id,
        })
        return { redirect: `${url}/error?error=OAuthCallback`, cookies }
      }
      logger.error("OAUTH_CALLBACK_ERROR", error as Error)
      return { redirect: `${url}/error?error=Callback`, cookies }
    }
  } else if (provider.type === "email") {
    try {
      const token = query?.token as string | undefined
      const identifier = query?.email as string | undefined

      // If these are missing, the sign-in URL was manually opened without these params or the `sendVerificationRequest` method did not send the link correctly in the email.
      if (!token || !identifier) {
        return { redirect: `${url}/error?error=configuration`, cookies }
      }

      // @ts-expect-error -- Verified in `assertConfig`. adapter: Adapter<true>
      const invite = await adapter.useVerificationToken({
        identifier,
        token: hashToken(token, options),
      })

      const invalidInvite = !invite || invite.expires.valueOf() < Date.now()
      if (invalidInvite) {
        return { redirect: `${url}/error?error=Verification`, cookies }
      }

      const profile = await getAdapterUserFromEmail({
        email: identifier,
        // @ts-expect-error -- Verified in `assertConfig`. adapter: Adapter<true>
        adapter,
      })

      const account = {
        providerAccountId: profile.email,
        type: "email" as const,
        provider: provider.id,
      }

      // Check if user is allowed to sign in
      try {
        const signInCallbackResponse = await callbacks.signIn({
          user: profile,
          account,
        })
        if (!signInCallbackResponse) {
          return { redirect: `${url}/error?error=AccessDenied`, cookies }
        } else if (typeof signInCallbackResponse === "string") {
          return { redirect: signInCallbackResponse, cookies }
        }
      } catch (error) {
        return {
          redirect: `${url}/error?error=${encodeURIComponent(
            (error as Error).message
          )}`,
          cookies,
        }
      }

      // Sign user in
      const { user, session, isNewUser } = await callbackHandler({
        sessionToken: sessionStore.value,
        profile,
        account,
        options,
      })

      if (useJwtSession) {
        const defaultToken = {
          name: user.name,
          email: user.email,
          picture: user.image,
          sub: user.id?.toString(),
        }
        const token = await callbacks.jwt({
          token: defaultToken,
          user,
          account,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        })

        // Encode token
        const newToken = await jwt.encode({ ...jwt, token })

        // Set cookie expiry date
        const cookieExpires = new Date()
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

        const sessionCookies = sessionStore.chunk(newToken, {
          expires: cookieExpires,
        })
        cookies.push(...sessionCookies)
      } else {
        // Save Session Token in cookie
        cookies.push({
          name: options.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: (session as AdapterSession).expires,
          },
        })
      }

      await events.signIn?.({ user, account, isNewUser })

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }callbackUrl=${encodeURIComponent(callbackUrl)}`,
          cookies,
        }
      }

      // Callback URL is already verified at this point, so safe to use if specified
      return { redirect: callbackUrl, cookies }
    } catch (error) {
      if ((error as Error).name === "CreateUserError") {
        return { redirect: `${url}/error?error=EmailCreateAccount`, cookies }
      }
      logger.error("CALLBACK_EMAIL_ERROR", error as Error)
      return { redirect: `${url}/error?error=Callback`, cookies }
    }
  } else if (provider.type === "credentials" && method === "POST") {
    const credentials = body

    let user: User | null
    try {
      user = await provider.authorize(credentials, {
        query,
        body,
        headers,
        method,
      })
      if (!user) {
        return {
          status: 401,
          redirect: `${url}/error?${new URLSearchParams({
            error: "CredentialsSignin",
            provider: provider.id,
          })}`,
          cookies,
        }
      }
    } catch (error) {
      return {
        status: 401,
        redirect: `${url}/error?error=${encodeURIComponent(
          (error as Error).message
        )}`,
        cookies,
      }
    }

    /** @type {import("src").Account} */
    const account = {
      providerAccountId: user.id,
      type: "credentials",
      provider: provider.id,
    }

    try {
      const isAllowed = await callbacks.signIn({
        user,
        // @ts-expect-error
        account,
        credentials,
      })
      if (!isAllowed) {
        return {
          status: 403,
          redirect: `${url}/error?error=AccessDenied`,
          cookies,
        }
      } else if (typeof isAllowed === "string") {
        return { redirect: isAllowed, cookies }
      }
    } catch (error) {
      return {
        redirect: `${url}/error?error=${encodeURIComponent(
          (error as Error).message
        )}`,
        cookies,
      }
    }

    const defaultToken = {
      name: user.name,
      email: user.email,
      picture: user.image,
      sub: user.id?.toString(),
    }

    const token = await callbacks.jwt({
      token: defaultToken,
      user,
      // @ts-expect-error
      account,
      isNewUser: false,
      trigger: "signIn",
    })

    // Encode token
    const newToken = await jwt.encode({ ...jwt, token })

    // Set cookie expiry date
    const cookieExpires = new Date()
    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

    const sessionCookies = sessionStore.chunk(newToken, {
      expires: cookieExpires,
    })

    cookies.push(...sessionCookies)

    // @ts-expect-error
    await events.signIn?.({ user, account })

    return { redirect: callbackUrl, cookies }
  }
  return {
    status: 500,
    body: `Error: Callback for provider type ${provider.type} not supported`,
    cookies,
  }
}
