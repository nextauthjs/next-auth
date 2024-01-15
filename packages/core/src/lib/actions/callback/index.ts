// TODO: Make this file smaller

import {
  AuthError,
  AuthorizedCallbackError,
  CallbackRouteError,
  CredentialsSignin,
  InvalidProvider,
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
    throw new InvalidProvider("Callback route called without provider")
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
      let userByAccount
      if (adapter) {
        const { getUserByAccount } = adapter
        userByAccount = await getUserByAccount({
          providerAccountId: account.providerAccountId,
          provider: provider.id,
        })
      }

      await handleAuthorized(
        {
          user: userByAccount ?? userFromProvider,
          account,
          profile: OAuthProfile,
        },
        options.callbacks.signIn
      )

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

      await events.signIn?.({
        user,
        account,
        profile: OAuthProfile,
        isNewUser,
      })

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
        id: crypto.randomUUID(),
        email: identifier,
        emailVerified: null,
      }

      const account: Account = {
        providerAccountId: user.email,
        userId: user.id,
        type: "email" as const,
        provider: provider.id,
      }

      await handleAuthorized({ user, account }, options.callbacks.signIn)

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
      const userFromAuthorize = await provider.authorize(
        credentials,
        // prettier-ignore
        new Request(url, { headers, method, body: JSON.stringify(body) })
      )
      const user = userFromAuthorize && {
        ...userFromAuthorize,
        id: userFromAuthorize?.id?.toString() ?? crypto.randomUUID(),
      }

      if (!user) throw new CredentialsSignin()

      const account = {
        providerAccountId: user.id,
        type: "credentials",
        provider: provider.id,
      } satisfies Account

      await handleAuthorized(
        { user, account, credentials },
        options.callbacks.signIn
      )

      const defaultToken = {
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user.id,
      }

      const token = await callbacks.jwt({
        token: defaultToken,
        user,
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

      await events.signIn?.({ user, account })

      return { redirect: callbackUrl, cookies }
    }

    throw new InvalidProvider(
      `Callback for provider type (${provider.type}) is not supported`
    )
  } catch (e) {
    if (e instanceof AuthError) throw e
    const error = new CallbackRouteError(e as Error, { provider: provider.id })
    logger.debug("callback route error details", { method, query, body })
    throw error
  }
}

async function handleAuthorized(
  params: Parameters<InternalOptions["callbacks"]["signIn"]>[0],
  signIn: InternalOptions["callbacks"]["signIn"]
) {
  try {
    const authorized = await signIn(params)
    if (!authorized) throw new AuthorizedCallbackError("AccessDenied")
  } catch (e) {
    if (e instanceof AuthError) throw e
    throw new AuthorizedCallbackError(e as Error)
  }
}
