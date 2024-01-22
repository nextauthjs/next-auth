import { InvalidProvider, MissingAdapter } from "../../errors.js"
import { session as routeSession } from "./session.js"
import type { InternalOptions, RequestInternal, ResponseInternal } from "../../types.js"
import type { Cookie, SessionStore } from "../utils/cookie.js"
import type { WebAuthnProviderType, UserInfo } from "../../providers/webauthn.js"
import type { Adapter, AdapterUser } from "../../adapters.js"
import { webauthnChallenge } from "./callback/oauth/checks.js"
import { generateAuthenticationOptions, generateRegistrationOptions } from "@simplewebauthn/server"

/**
 * Returns authentication or registration options for a WebAuthn flow
 * depending on the parameters provided.
 */
export async function webAuthnOptions(
  request: RequestInternal,
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[]
): Promise<ResponseInternal> {
  const { provider, adapter } = options
  if (!adapter) throw new MissingAdapter(
    "An adapter is required for the WebAuthn provider"
  )

  // Provider must be WebAuthn
  if (!provider || provider.type !== "webauthn") {
    throw new InvalidProvider("Provider must be WebAuthn")
  }

  // Extract the action from the query parameters
  const { action } = (request.query ?? {}) as Record<string, unknown>

  // Action must be either "register", "authenticate", or undefined
  if (action !== "register" && action !== "authenticate" && typeof action !== "undefined") {
    action
    return {
      status: 400,
      body: JSON.stringify({ error: "Invalid action parameter" }),
      cookies,
    }
  }

  // Get the current session, if it exists
  // NOTE: this is a bit hacky, but routes.session seems to be
  // the only place that implements a full session/user check.
  const { body: currentSession } = await routeSession(options, sessionStore, cookies)
  let sessionUser: Pick<AdapterUser, "name" | "email" | "id"> | undefined = undefined
  if (currentSession?.user && currentSession.user.id && currentSession.user.email) {
    sessionUser = {
      id: currentSession.user.id,
      email: currentSession.user.email,
      name: currentSession.user.name,
    }
  }
  const loggedIn = !!sessionUser


  let userInfo: UserInfo | undefined = undefined
  let exists: boolean = false
  try {
    const res = await provider.getUserInfo(options, request, sessionUser)
    userInfo = res.userInfo
    exists = res.exists
  } catch (e) { }

  switch (action) {
    case "authenticate": {
      return doAuthenticate(options, adapter, cookies, userInfo)
    }
    case "register": {
      if (userInfo) {
        return doRegister(options, adapter, cookies, userInfo)
      }

      break
    }
    case undefined: {
      // If the user is logged in, webauthn options should always provide an explicit action
      if (!loggedIn) {
        if (exists) {
          // If the provided user exists, return authentication options
          return doAuthenticate(options, adapter, cookies, userInfo)
        } else if (userInfo) {
          // If the provided user does not exist, return registration options
          return doRegister(options, adapter, cookies, userInfo)
        }
      }

      break
    }
  }

  return {
    status: 400,
    body: "Invalid request",
    cookies,
  }
}


async function doRegister(options: InternalOptions<WebAuthnProviderType>, adapter: Required<Adapter>, cookies: Cookie[], userInfo: UserInfo): Promise<ResponseInternal> {
  // Get registration options
  const regOptions = await getRegistrationOptions(options, adapter, userInfo)

  // Set the cookie
  const { cookie } = await webauthnChallenge.create(options, regOptions.challenge, userInfo.userID)

  // Return the response
  return {
    status: 200,
    body: { options: regOptions, action: "register" },
    cookies: [...cookies, cookie],
  }
}

async function doAuthenticate(options: InternalOptions<WebAuthnProviderType>, adapter: Required<Adapter>, cookies: Cookie[], userInfo?: UserInfo): Promise<ResponseInternal> {
  // Get authentication options
  const authOptions = await getAuthenticationParams(options, adapter, userInfo)

  // Set the cookie
  const { cookie } = await webauthnChallenge.create(options, authOptions.challenge)

  // Return the response
  return {
    status: 200,
    body: { options: authOptions, action: "authenticate" },
    cookies: [...cookies, cookie],
  }
}


async function getAuthenticationParams(options: InternalOptions<WebAuthnProviderType>, adapter: Required<Adapter>, userInfo?: UserInfo) {
  const { provider } = options

  // Get the user's authenticators.
  const authenticators = userInfo ? await adapter.listAuthenticatorsByUserId(userInfo.userID) : null

  // Return the authentication options.
  return await generateAuthenticationOptions({
    ...provider.authenticationOptions,
    rpID: provider.relayingParty.id,
    allowCredentials: authenticators?.map((a) => ({
      id: a.credentialID,
      type: "public-key",
      transports: a.transports,
    })),
  })
}


async function getRegistrationOptions(options: InternalOptions<WebAuthnProviderType>, adapter: Required<Adapter>, userInfo: UserInfo) {
  const { provider } = options

  // Get the user's authenticators.
  const authenticators = await adapter.listAuthenticatorsByUserId(userInfo.userID)

  // Return the registration options.
  return await generateRegistrationOptions({
    ...provider.registrationOptions,
    ...userInfo,
    rpID: provider.relayingParty.id,
    rpName: provider.relayingParty.name,
    excludeCredentials: authenticators?.map((a) => ({
      id: a.credentialID,
      type: "public-key",
      transports: a.transports,
    })),
  })
}
