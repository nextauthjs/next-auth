import oAuthCallback from "../lib/oauth/callback"
import callbackHandler from "../lib/callback-handler"
import { hashToken } from "../lib/utils"

import type { InternalOptions } from "../../lib/types"
import type { IncomingRequest, OutgoingResponse } from ".."
import type { Cookie, SessionStore } from "../lib/cookie"
import type { User } from "../.."

/** Handle callbacks from login services */
export default async function callback(params: {
  options: InternalOptions<"oauth" | "credentials" | "email">
  query: IncomingRequest["query"]
  method: IncomingRequest["method"]
  body: IncomingRequest["body"]
  headers: IncomingRequest["headers"]
  cookies: IncomingRequest["cookies"]
  sessionStore: SessionStore
}): Promise<OutgoingResponse> {
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

      if (oauthCookies) cookies.push(...oauthCookies)

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
        if (!profile) {
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
            // @ts-expect-error
            providerAccountId: account.providerAccountId,
            provider: provider.id,
          })

          if (userByAccount) userOrProfile = userByAccount
        }

        try {
          const isAllowed = await callbacks.signIn({
            user: userOrProfile,
            // @ts-expect-error
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
        // @ts-expect-error
        const { user, session, isNewUser } = await callbackHandler({
          sessionToken: sessionStore.value,
          profile,
          // @ts-expect-error
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
            // @ts-expect-error
            account,
            profile: OAuthProfile,
            isNewUser,
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
            value: session.sessionToken,
            options: {
              ...options.cookies.sessionToken.options,
              expires: session.expires,
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
        logger.error("CALLBACK_OAUTH_ERROR", error as Error)
        return { redirect: `${url}/error?error=OAuthCallback`, cookies }
      }
      logger.error("OAUTH_CALLBACK_ERROR", error as Error)
      return { redirect: `${url}/error?error=Callback`, cookies }
    }
  } else if (provider.type === "email") {
    try {
      // Verified in `assertConfig`
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { useVerificationToken, getUserByEmail } = adapter!

      const token = query?.token
      const identifier = query?.email

      const invite = await useVerificationToken?.({
        identifier,
        token: hashToken(token, options),
      })

      const invalidInvite = !invite || invite.expires.valueOf() < Date.now()
      if (invalidInvite) {
        return { redirect: `${url}/error?error=Verification`, cookies }
      }

      // If it is an existing user, use that, otherwise use a placeholder
      const profile = (identifier
        ? await getUserByEmail(identifier)
        : null) ?? {
        email: identifier,
      }

      /** @type {import("src").Account} */
      const account = {
        providerAccountId: profile.email,
        type: "email",
        provider: provider.id,
      }

      // Check if user is allowed to sign in
      try {
        const signInCallbackResponse = await callbacks.signIn({
          // @ts-expect-error
          user: profile,
          // @ts-expect-error
          account,
          // @ts-expect-error
          email: { email: identifier },
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
      // @ts-expect-error
      const { user, session, isNewUser } = await callbackHandler({
        sessionToken: sessionStore.value,
        // @ts-expect-error
        profile,
        // @ts-expect-error
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
          // @ts-expect-error
          account,
          isNewUser,
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
          value: session.sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: session.expires,
          },
        })
      }

      // @ts-expect-error
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

    let user: User
    try {
      user = (await provider.authorize(credentials, {
        query,
        body,
        headers,
        method,
      })) as User
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
