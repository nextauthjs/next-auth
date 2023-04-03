import { handleLogin } from "../callback-handler.js"
import { CallbackRouteError, Verification } from "../../errors.js"
import { handleOAuth } from "../oauth/callback.js"
import { createHash } from "../web.js"
import { handleAuthorized } from "./shared.js"

import type { AdapterSession } from "../../adapters.js"
import type {
  RequestInternal,
  ResponseInternal,
  InternalOptions,
  Account,
} from "../../types.js"
import type { Cookie, SessionStore } from "../cookie.js"

/** Handle callbacks from login services */
export async function callback(params: {
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

  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      const authorizationResult = await handleOAuth(
        query,
        params.cookies,
        options
      )

      if (authorizationResult.cookies.length) {
        cookies.push(...authorizationResult.cookies)
      }

      logger.debug("authorization result", authorizationResult)

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
        options
      )

      if (unauthorizedOrError) return { ...unauthorizedOrError, cookies }

      // Sign user in
      const { user, session, isNewUser } = await handleLogin(
        sessionStore.value,
        profile,
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
        })

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean())
        } else {
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token })

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

      // @ts-expect-error
      await events.signIn?.({ user, account, profile, isNewUser })

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
      } = await handleLogin(sessionStore.value, user, account, options)

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
        })

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean())
        } else {
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token })

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
      })

      // Clear cookies if token is null
      if (token === null) {
        cookies.push(...sessionStore.clean())
      } else {
        // Encode token
        const newToken = await jwt.encode({ ...jwt, token })

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
    const error = new CallbackRouteError(e as Error, { provider: provider.id })

    logger.error(error)
    url.searchParams.set("error", CallbackRouteError.name)
    url.pathname += "/error"
    return { redirect: url.toString(), cookies }
  }
}
