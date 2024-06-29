import type { WebAuthnProviderType } from "../../providers/webauthn.js"
import type {
  Account,
  Authenticator,
  Awaited,
  InternalOptions,
  RequestInternal,
  ResponseInternal,
  User,
} from "../../types.js"
import type { Cookie } from "./cookie.js"
import {
  AdapterError,
  AuthError,
  InvalidProvider,
  MissingAdapter,
  WebAuthnVerificationError,
} from "../../errors.js"
import { webauthnChallenge } from "../actions/callback/oauth/checks.js"
import {
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/types"
import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
} from "../../adapters.js"
import type { GetUserInfo } from "../../providers/webauthn.js"
import { randomString } from "./web.js"
import type {
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server"

export type WebAuthnRegister = "register"
export type WebAuthnAuthenticate = "authenticate"
export type WebAuthnAction = WebAuthnRegister | WebAuthnAuthenticate

type InternalOptionsWebAuthn = InternalOptions<WebAuthnProviderType> & {
  adapter: Required<Adapter>
}
export type WebAuthnOptionsResponseBody =
  | {
      action: WebAuthnAuthenticate
      options: PublicKeyCredentialRequestOptionsJSON
    }
  | {
      action: WebAuthnRegister
      options: PublicKeyCredentialCreationOptionsJSON
    }
type WebAuthnOptionsResponse = ResponseInternal & {
  body: WebAuthnOptionsResponseBody
}

export type CredentialDeviceType = "singleDevice" | "multiDevice"
interface InternalAuthenticator {
  providerAccountId: string
  credentialID: Uint8Array
  credentialPublicKey: Uint8Array
  counter: number
  credentialDeviceType: CredentialDeviceType
  credentialBackedUp: boolean
  transports?: AuthenticatorTransport[]
}

type RGetUserInfo = Awaited<ReturnType<GetUserInfo>>

/**
 * Infers the WebAuthn options based on the provided parameters.
 *
 * @param action - The WebAuthn action to perform (optional).
 * @param loggedInUser - The logged-in user (optional).
 * @param userInfoResponse - The response containing user information (optional).
 *
 * @returns The WebAuthn action to perform, or null if no inference could be made.
 */
export function inferWebAuthnOptions(
  action: WebAuthnAction | undefined,
  loggedIn: boolean,
  userInfoResponse: RGetUserInfo
): WebAuthnAction | null {
  const { user, exists = false } = userInfoResponse ?? {}

  switch (action) {
    case "authenticate": {
      /**
       * Always allow explicit authentication requests.
       */
      return "authenticate"
    }
    case "register": {
      /**
       * Registration is only allowed if:
       * - The user is logged in, meaning the user wants to register a new authenticator.
       * - The user is not logged in and provided user info that does NOT exist, meaning the user wants to register a new account.
       */
      if (user && loggedIn === exists) return "register"
      break
    }
    case undefined: {
      /**
       * When no explicit action is provided, we try to infer it based on the user info provided. These are the possible cases:
       * - Logged in users must always send an explit action, so we bail out in this case.
       * - Otherwise, if no user info is provided, the desired action is authentication without pre-defined authenticators.
       * - Otherwise, if the user info provided is of an existing user, the desired action is authentication with their pre-defined authenticators.
       * - Finally, if the user info provided is of a non-existing user, the desired action is registration.
       */
      if (!loggedIn) {
        if (user) {
          if (exists) {
            return "authenticate"
          } else {
            return "register"
          }
        } else {
          return "authenticate"
        }
      }
      break
    }
  }

  // No decision could be made
  return null
}

/**
 * Retrieves the registration response for WebAuthn options request.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - The user information.
 * @param resCookies - Optional cookies to be included in the response.
 * @returns A promise that resolves to the WebAuthnOptionsResponse.
 */
export async function getRegistrationResponse(
  options: InternalOptionsWebAuthn,
  request: RequestInternal,
  user: User & { email: string },
  resCookies?: Cookie[]
): Promise<WebAuthnOptionsResponse> {
  // Get registration options
  const regOptions = await getRegistrationOptions(options, request, user)
  // Get signed cookie
  const { cookie } = await webauthnChallenge.create(
    options,
    regOptions.challenge,
    user
  )

  return {
    status: 200,
    cookies: [...(resCookies ?? []), cookie],
    body: {
      action: "register" as const,
      options: regOptions,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }
}

/**
 * Retrieves the authentication response for WebAuthn options request.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - Optional user information.
 * @param resCookies - Optional array of cookies to be included in the response.
 * @returns A promise that resolves to a WebAuthnOptionsResponse object.
 */
export async function getAuthenticationResponse(
  options: InternalOptionsWebAuthn,
  request: RequestInternal,
  user?: User,
  resCookies?: Cookie[]
): Promise<WebAuthnOptionsResponse> {
  // Get authentication options
  const authOptions = await getAuthenticationOptions(options, request, user)
  // Get signed cookie
  const { cookie } = await webauthnChallenge.create(
    options,
    authOptions.challenge
  )

  return {
    status: 200,
    cookies: [...(resCookies ?? []), cookie],
    body: {
      action: "authenticate" as const,
      options: authOptions,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }
}

export async function verifyAuthenticate(
  options: InternalOptionsWebAuthn,
  request: RequestInternal,
  resCookies: Cookie[]
): Promise<{ account: AdapterAccount; user: User }> {
  const { adapter, provider } = options

  // Get WebAuthn response from request body
  const data =
    request.body && typeof request.body.data === "string"
      ? (JSON.parse(request.body.data) as unknown)
      : undefined
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  ) {
    throw new AuthError("Invalid WebAuthn Authentication response")
  }

  // Reset the ID so we smooth out implementation differences
  const credentialID = toBase64(fromBase64(data.id))

  // Get authenticator from database
  const authenticator = await adapter.getAuthenticator(credentialID)
  if (!authenticator) {
    throw new AuthError(
      `WebAuthn authenticator not found in database: ${JSON.stringify({
        credentialID,
      })}`
    )
  }

  // Get challenge from request cookies
  const { challenge: expectedChallenge } = await webauthnChallenge.use(
    options,
    request.cookies,
    resCookies
  )

  // Verify the response
  let verification: VerifiedAuthenticationResponse
  try {
    const relayingParty = provider.getRelayingParty(options, request)
    verification = await provider.simpleWebAuthn.verifyAuthenticationResponse({
      ...provider.verifyAuthenticationOptions,
      expectedChallenge,
      response: data as AuthenticationResponseJSON,
      authenticator: fromAdapterAuthenticator(authenticator),
      expectedOrigin: relayingParty.origin,
      expectedRPID: relayingParty.id,
    })
  } catch (e: any) {
    throw new WebAuthnVerificationError(e)
  }

  const { verified, authenticationInfo } = verification

  // Make sure the response was verified
  if (!verified) {
    throw new WebAuthnVerificationError(
      "WebAuthn authentication response could not be verified"
    )
  }

  // Update authenticator counter
  try {
    const { newCounter } = authenticationInfo
    await adapter.updateAuthenticatorCounter(
      authenticator.credentialID,
      newCounter
    )
  } catch (e: any) {
    throw new AdapterError(
      `Failed to update authenticator counter. This may cause future authentication attempts to fail. ${JSON.stringify(
        {
          credentialID,
          oldCounter: authenticator.counter,
          newCounter: authenticationInfo.newCounter,
        }
      )}`,
      e
    )
  }

  // Get the account and user
  const account = await adapter.getAccount(
    authenticator.providerAccountId,
    provider.id
  )
  if (!account) {
    throw new AuthError(
      `WebAuthn account not found in database: ${JSON.stringify({
        credentialID,
        providerAccountId: authenticator.providerAccountId,
      })}`
    )
  }

  const user = await adapter.getUser(account.userId)
  if (!user) {
    throw new AuthError(
      `WebAuthn user not found in database: ${JSON.stringify({
        credentialID,
        providerAccountId: authenticator.providerAccountId,
        userID: account.userId,
      })}`
    )
  }

  return {
    account,
    user,
  }
}

export async function verifyRegister(
  options: InternalOptions<WebAuthnProviderType>,
  request: RequestInternal,
  resCookies: Cookie[]
): Promise<{ account: Account; user: User; authenticator: Authenticator }> {
  const { provider } = options

  // Get WebAuthn response from request body
  const data =
    request.body && typeof request.body.data === "string"
      ? (JSON.parse(request.body.data) as unknown)
      : undefined
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  ) {
    throw new AuthError("Invalid WebAuthn Registration response")
  }

  // Get challenge from request cookies
  const { challenge: expectedChallenge, registerData: user } =
    await webauthnChallenge.use(options, request.cookies, resCookies)
  if (!user) {
    throw new AuthError(
      "Missing user registration data in WebAuthn challenge cookie"
    )
  }

  // Verify the response
  let verification: VerifiedRegistrationResponse
  try {
    const relayingParty = provider.getRelayingParty(options, request)
    verification = await provider.simpleWebAuthn.verifyRegistrationResponse({
      ...provider.verifyRegistrationOptions,
      expectedChallenge,
      response: data as RegistrationResponseJSON,
      expectedOrigin: relayingParty.origin,
      expectedRPID: relayingParty.id,
    })
  } catch (e: any) {
    throw new WebAuthnVerificationError(e)
  }

  // Make sure the response was verified
  if (!verification.verified || !verification.registrationInfo) {
    throw new WebAuthnVerificationError(
      "WebAuthn registration response could not be verified"
    )
  }

  // Build a new account
  const account = {
    providerAccountId: toBase64(verification.registrationInfo.credentialID),
    provider: options.provider.id,
    type: provider.type,
  }

  // Build a new authenticator
  const authenticator = {
    providerAccountId: account.providerAccountId,
    counter: verification.registrationInfo.counter,
    credentialID: toBase64(verification.registrationInfo.credentialID),
    credentialPublicKey: toBase64(
      verification.registrationInfo.credentialPublicKey
    ),
    credentialBackedUp: verification.registrationInfo.credentialBackedUp,
    credentialDeviceType: verification.registrationInfo.credentialDeviceType,
    transports: transportsToString(
      (data as RegistrationResponseJSON).response
        .transports as AuthenticatorTransport[]
    ),
  }

  // Return created stuff
  return {
    user,
    account,
    authenticator,
  }
}

/**
 * Generates WebAuthn authentication options.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - Optional user information.
 * @returns The authentication options.
 */
async function getAuthenticationOptions(
  options: InternalOptionsWebAuthn,
  request: RequestInternal,
  user?: User
) {
  const { provider, adapter } = options

  // Get the user's authenticators.
  const authenticators =
    user && user["id"]
      ? await adapter.listAuthenticatorsByUserId(user.id)
      : null

  const relayingParty = provider.getRelayingParty(options, request)

  // Return the authentication options.
  return await provider.simpleWebAuthn.generateAuthenticationOptions({
    ...provider.authenticationOptions,
    rpID: relayingParty.id,
    allowCredentials: authenticators?.map((a) => ({
      id: fromBase64(a.credentialID),
      type: "public-key",
      transports: stringToTransports(a.transports),
    })),
  })
}

/**
 * Generates WebAuthn registration options.
 *
 * @param options - The internal options for WebAuthn.
 * @param request - The request object.
 * @param user - The user information.
 * @returns The registration options.
 */
async function getRegistrationOptions(
  options: InternalOptionsWebAuthn,
  request: RequestInternal,
  user: User & { email: string }
) {
  const { provider, adapter } = options

  // Get the user's authenticators.
  const authenticators = user["id"]
    ? await adapter.listAuthenticatorsByUserId(user.id)
    : null

  // Generate a random user ID for the credential.
  // We can do this because we don't use this user ID to link the
  // credential to the user. Instead, we store actual userID in the
  // Authenticator object and fetch it via it's credential ID.
  const userID = randomString(32)

  const relayingParty = provider.getRelayingParty(options, request)

  // Return the registration options.
  return await provider.simpleWebAuthn.generateRegistrationOptions({
    ...provider.registrationOptions,
    userID,
    userName: user.email,
    userDisplayName: user.name ?? undefined,
    rpID: relayingParty.id,
    rpName: relayingParty.name,
    excludeCredentials: authenticators?.map((a) => ({
      id: fromBase64(a.credentialID),
      type: "public-key",
      transports: stringToTransports(a.transports),
    })),
  })
}

export function assertInternalOptionsWebAuthn(
  options: InternalOptions
): InternalOptionsWebAuthn {
  const { provider, adapter } = options

  // Adapter is required for WebAuthn
  if (!adapter)
    throw new MissingAdapter("An adapter is required for the WebAuthn provider")
  // Provider must be WebAuthn
  if (!provider || provider.type !== "webauthn") {
    throw new InvalidProvider("Provider must be WebAuthn")
  }
  // Narrow the options type for typed usage later
  return { ...options, provider, adapter }
}

function fromAdapterAuthenticator(
  authenticator: AdapterAuthenticator
): InternalAuthenticator {
  return {
    ...authenticator,
    credentialDeviceType:
      authenticator.credentialDeviceType as InternalAuthenticator["credentialDeviceType"],
    transports: stringToTransports(authenticator.transports),
    credentialID: fromBase64(authenticator.credentialID),
    credentialPublicKey: fromBase64(authenticator.credentialPublicKey),
  }
}

export function fromBase64(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, "base64"))
}

export function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64")
}

export function transportsToString(
  transports: InternalAuthenticator["transports"]
) {
  return transports?.join(",")
}

export function stringToTransports(
  tstring: string | undefined | null
): InternalAuthenticator["transports"] {
  return tstring
    ? (tstring.split(",") as InternalAuthenticator["transports"])
    : undefined
}
