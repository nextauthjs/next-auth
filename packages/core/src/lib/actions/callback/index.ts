// TODO: Make this file smaller

import {
  AuthorizedCallbackError,
  CallbackRouteError,
  MissingProvider,
  OAuthCallbackError,
  Verification,
} from "../../../errors.js"
import { handleLoginOrRegister } from "./handle-login.js"
import { handleOAuth } from "./oauth/callback.js"
import { handleState } from "./oauth/checks.js"
import { createHash } from "../../utils/web.js"

import type { AdapterSession } from "../../../adapters.js"
import type {
  Account,
  InternalOptions,
  RequestInternal,
  ResponseInternal,
} from "../../../types.js"
import type { Cookie, SessionStore } from "../../utils/cookie.js"

/** Handle callbacks from login services */
export async function callback(
  request: RequestInternal,
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[]
): Promise<ResponseInternal> {
  if (!options.provider)
    throw new MissingProvider("Callback route called without provider")
  const { query, body, method, headers } = request
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

  const useJwtSession = sessionStrategy === "jwt"

  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      const { proxyRedirect, randomState } = handleState(
        query,
        provider,
        options.isOnRedirectProxy
      )

      if (proxyRedirect) {
        logger.debug("proxy redirect", { proxyRedirect, randomState })
        return { redirect: proxyRedirect }
      }

      const authorizationResult = await handleOAuth(
        query,
        request.cookies,
        options,
        randomState
      )

      if (authorizationResult.cookies.length) {
        cookies.push(...authorizationResult.cookies)
      }

      logger.debug("authorization result", authorizationResult)

      const {
        user: userFromProvider,
        account,
        profile: OAuthProfile,
      } = authorizationResult

      // If we don't have a profile object then either something went wrong
      // or the user cancelled signing in. We don't know which, so we just
      // direct the user to the signin page for now. We could do something
      // else in future.
      // TODO: Handle user cancelling signin
      if (!userFromProvider || !account || !OAuthProfile) {
        return { redirect: `${url}/signin`, cookies }
      }

      // Check if user is allowed to sign in
      // Attempt to get Profile from OAuth provider details before invoking
      // signIn callback - but if no user object is returned, that is fine
      // (that just means it's a new user signing in for the first time).
      let userByAccountOrFromProvider
      if (adapter) {
        const { getUserByAccount } = adapter
        const userByAccount = await getUserByAccount({
          providerAccountId: account.providerAccountId,
          provider: provider.id,
        })

        if (userByAccount) userByAccountOrFromProvider = userByAccount
      }

      const unauthorizedOrError = await handleAuthorized(
        {
          user: userByAccountOrFromProvider,
          account,
          profile: OAuthProfile,
        },
        options
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

      const { user, session, isNewUser } = await handleLoginOrRegister(
        sessionStore.value,
        userFromProvider,
        account,
        options
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
          trigger: isNewUser ? "signUp" : "signIn",
        })

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean())
        } else {
          const salt = options.cookies.sessionToken.name
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token, salt })

          // Set cookie expiry date
          const cookieExpires = new Date()
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          })
          cookies.push(...sessionCookies)
        }
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

      await events.signIn?.({ user, account, profile: OAuthProfile, isNewUser })

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl })}`,
          cookies,
        }
      }

      return { redirect: callbackUrl, cookies }
    } else if (provider.type === "email") {
      const token = query?.token as string | undefined
      const identifier = query?.email as string | undefined

      if (!token || !identifier) {
        const e = new TypeError(
          "Missing token or email. The sign-in URL was manually opened without token/identifier or the link was not sent correctly in the email.",
          { cause: { hasToken: !!token, hasEmail: !!identifier } }
        )
        e.name = "Configuration"
        throw e
      }

      const secret = provider.secret ?? options.secret
      // @ts-expect-error -- Verified in `assertConfig`.
      const invite = await adapter.useVerificationToken({
        identifier,
        token: await createHash(`${token}${secret}`),
      })

      const hasInvite = !!invite
      const expired = invite ? invite.expires.valueOf() < Date.now() : undefined
      const invalidInvite = !hasInvite || expired
      if (invalidInvite) throw new Verification({ hasInvite, expired })

      const user = (await adapter!.getUserByEmail(identifier)) ?? {
        id: identifier,
        email: identifier,
        emailVerified: null,
      }

      const account: Account = {
        providerAccountId: user.email,
        userId: user.id,
        type: "email" as const,
        provider: provider.id,
      }

      // Check if user is allowed to sign in
      const unauthorizedOrError = await handleAuthorized(
        { user, account },
        options
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

      // Sign user in
      const {
        user: loggedInUser,
        session,
        isNewUser,
      } = await handleLoginOrRegister(
        sessionStore.value,
        user,
        account,
        options
      )

      if (useJwtSession) {
        const defaultToken = {
          name: loggedInUser.name,
          email: loggedInUser.email,
          picture: loggedInUser.image,
          sub: loggedInUser.id?.toString(),
        }
        const token = await callbacks.jwt({
          token: defaultToken,
          user: loggedInUser,
          account,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        })

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean())
        } else {
          const salt = options.cookies.sessionToken.name
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token, salt })

          // Set cookie expiry date
          const cookieExpires = new Date()
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          })
          cookies.push(...sessionCookies)
        }
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

      await events.signIn?.({ user: loggedInUser, account, isNewUser })

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl })}`,
          cookies,
        }
      }

      // Callback URL is already verified at this point, so safe to use if specified
      return { redirect: callbackUrl, cookies }
    } else if (provider.type === "credentials" && method === "POST") {
      const credentials = body ?? {}

      // TODO: Forward the original request as is, instead of reconstructing it
      Object.entries(query ?? {}).forEach(([k, v]) =>
        url.searchParams.set(k, v)
      )
      const user = await provider.authorize(
        credentials,
        // prettier-ignore
        new Request(url, { headers, method, body: JSON.stringify(body) })
      )
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

      /** @type {import("src").Account} */
      const account = {
        providerAccountId: user.id,
        type: "credentials",
        provider: provider.id,
      }

      const unauthorizedOrError = await handleAuthorized(
        { user, account, credentials },
        options
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
        trigger: "signIn",
      })

      // Clear cookies if token is null
      if (token === null) {
        cookies.push(...sessionStore.clean())
      } else {
        const salt = options.cookies.sessionToken.name
        // Encode token
        const newToken = await jwt.encode({ ...jwt, token, salt })

        // Set cookie expiry date
        const cookieExpires = new Date()
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000)

        const sessionCookies = sessionStore.chunk(newToken, {
          expires: cookieExpires,
        })

        cookies.push(...sessionCookies)
      }

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
    if (e instanceof OAuthCallbackError) {
      logger.error(e)
      // REVIEW: Should we expose original error= and error_description=
      // Should we use a different name for error= then, since we already use it for all kind of errors?
      url.searchParams.set("error", OAuthCallbackError.name)
      url.pathname += "/signin"
      return { redirect: url.toString(), cookies }
    }

    const error = new CallbackRouteError(e as Error, { provider: provider.id })

    logger.debug("callback route error details", { method, query, body })
    logger.error(error)
    url.searchParams.set("error", CallbackRouteError.name)
    url.pathname += "/error"
    return { redirect: url.toString(), cookies }
  }
}

async function handleAuthorized(
  params: any,
  { url, logger, callbacks: { signIn } }: InternalOptions
) {
  try {
    const authorized = await signIn(params)
    if (!authorized) {
      url.pathname += "/error"
      logger.debug("User not authorized", params)
      url.searchParams.set("error", "AccessDenied")
      return { status: 403 as const, redirect: url.toString() }
    }
  } catch (e) {
    url.pathname += "/error"
    const error = new AuthorizedCallbackError(e as Error)
    logger.error(error)
    url.searchParams.set("error", "Configuration")
    return { status: 500 as const, redirect: url.toString() }
  }
}
