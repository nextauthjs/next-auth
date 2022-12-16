import { handleLogin } from "../callback-handler.js"
import { CallbackRouteError } from "../errors.js"
import { handleOAuth } from "../oauth/callback.js"
import { createHash } from "../web.js"
import { handleAuthorized } from "./shared.js"

import type { AdapterSession } from "../../adapters.js"
import type { RequestInternal, ResponseInternal, User } from "../../index.js"
import type { Cookie, SessionStore } from "../cookie.js"
import type { AuthConfigInternal } from "../types.js"

/** Handle callbacks from login services */
export async function callback(params: {
  config: AuthConfigInternal
  query: RequestInternal["query"]
  method: Required<RequestInternal>["method"]
  body: RequestInternal["body"]
  headers: RequestInternal["headers"]
  cookies: RequestInternal["cookies"]
  sessionStore: SessionStore
}): Promise<ResponseInternal> {
  const { config, query, body, method, headers, sessionStore } = params
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
  } = config

  const cookies: Cookie[] = []

  const useJwtSession = sessionStrategy === "jwt"

  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      const authorizationResult = await handleOAuth(
        query,
        params.cookies,
        config
      )

      if (authorizationResult.cookies.length) {
        cookies.push(...authorizationResult.cookies)
      }

      logger.debug("authroization result", authorizationResult)

      const { profile, account, OAuthProfile } = authorizationResult

      // If we don't have a profile object then either something went wrong
      // or the user cancelled signing in. We don't know which, so we just
      // direct the user to the signin page for now. We could do something
      // else in future.
      // TODO: Handle user cancelling signin
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

      const unauthorizedOrError = await handleAuthorized(
        { user: userOrProfile, account, profile: OAuthProfile },
        config
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

      // Sign user in
      const { user, session, isNewUser } = await handleLogin(
        sessionStore.value,
        profile,
        account,
        config
      )

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
          name: config.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...config.cookies.sessionToken.options,
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

      return { redirect: callbackUrl, cookies }
    } else if (provider.type === "email") {
      const token = query?.token as string | undefined
      const identifier = query?.email as string | undefined

      // If these are missing, the sign-in URL was manually opened without these params or the `sendVerificationRequest` method did not send the link correctly in the email.
      if (!token || !identifier) {
        return { redirect: `${url}/error?error=configuration`, cookies }
      }

      const secret = provider.secret ?? config.secret
      // @ts-expect-error -- Verified in `assertConfig`.
      const invite = await adapter.useVerificationToken({
        identifier,
        token: await createHash(`${token}${secret}`),
      })

      const invalidInvite = !invite || invite.expires.valueOf() < Date.now()
      if (invalidInvite) {
        return { redirect: `${url}/error?error=Verification`, cookies }
      }

      // @ts-expect-error -- Verified in `assertConfig`.
      const profile = await getAdapterUserFromEmail(identifier, adapter)

      const account = {
        providerAccountId: profile.email,
        type: "email" as const,
        provider: provider.id,
      }

      // Check if user is allowed to sign in
      const unauthorizedOrError = await handleAuthorized(
        { user: profile, account },
        config
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

      // Sign user in
      const { user, session, isNewUser } = await handleLogin(
        sessionStore.value,
        profile,
        account,
        config
      )

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
          name: config.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...config.cookies.sessionToken.options,
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

      const unauthorizedOrError = await handleAuthorized(
        { user, account, credentials },
        config
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

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
  } catch (e) {
    const error = new CallbackRouteError(e, { provider: provider.id })

    logger.error(error)
    url.searchParams.set("error", CallbackRouteError.name)
    url.pathname += "/error"
    return { redirect: url, cookies }
  }
}
