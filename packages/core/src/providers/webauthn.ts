import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"

import {
  MissingAdapter,
  AdapterError,
  AuthError,
  InvalidProvider,
  WebAuthnVerificationError,
  InvalidCheck,
} from "../errors.js"

import type {
  VerifiedAuthenticationResponse,
  VerifiedRegistrationResponse,
} from "@simplewebauthn/server"

import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  // @ts-expect-error TODO: Get this from an available import
} from "@simplewebauthn/server/script/deps"

import type { CommonProviderOptions, CredentialInput } from "./index.js"
import type {
  GenerateRegistrationOptionsOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server"

import type {
  InternalOptions,
  RequestInternal,
  SemverString,
  User,
  Account,
  Authenticator,
  Awaited,
  ResponseInternal,
} from "../types.js"

import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
} from "../../adapters.js"
import { Cookie } from "../lib/utils/cookie.js"

import { randomString } from "../lib/utils/web.js"
import { decode } from "../jwt.js"
import {
  CheckPayload,
  signCookie,
} from "../lib/actions/callback/oauth/checks.js"

export type WebAuthnProviderType = "webauthn"

export const DEFAULT_WEBAUTHN_TIMEOUT = 5 * 60 * 1000 // 5 minutes
export const DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION: SemverString = "v9.0.1"

export type RelayingParty = {
  /** Relaying Party ID. Use the website's domain name. */
  id: string
  /** Relaying Party name. Use the website's name. */
  name: string
  /** Relaying Party origin. Use the website's origin. */
  origin: string
}

type RelayingPartyArray = {
  /** Relaying Party ID. Use the website's domain name. */
  id: string | string[]
  /** Relaying Party name. Use the website's name. */
  name: string | string[]
  /** Relaying Party origin. Use the website's origin. */
  origin: string | string[]
}

export type GetUserInfo = (
  options: InternalOptions<WebAuthnProviderType>,
  request: RequestInternal
) => Promise<
  | { user: User; exists: true }
  | { user: Omit<User, "id">; exists: false }
  | null
>

type ConfigurableAuthenticationOptions = Omit<
  GenerateAuthenticationOptionsOpts,
  "rpID" | "allowCredentials" | "challenge"
>
type ConfigurableRegistrationOptions = Omit<
  GenerateRegistrationOptionsOpts,
  | "rpName"
  | "rpID"
  | "userID"
  | "userName"
  | "challenge"
  | "userDisplayName"
  | "excludeCredentials"
>
type ConfigurableVerifyAuthenticationOptions = Omit<
  VerifyAuthenticationResponseOpts,
  | "expectedChallenge"
  | "expectedOrigin"
  | "expectedRPID"
  | "authenticator"
  | "response"
>
type ConfigurableVerifyRegistrationOptions = Omit<
  VerifyRegistrationResponseOpts,
  "expectedChallenge" | "expectedOrigin" | "expectedRPID" | "response"
>

export interface WebAuthnConfig extends CommonProviderOptions {
  type: WebAuthnProviderType
  /**
   * Relaying party (RP) configuration
   *
   * If not provided, the request URL will be used.
   **/
  relayingParty?: Partial<RelayingPartyArray>
  /**
   * Function that returns the relaying party for the current request.
   */
  getRelayingParty: (
    options: InternalOptions<WebAuthnProviderType>,
    request: RequestInternal
  ) => RelayingParty
  /**
   * Enable conditional UI.
   *
   * NOTE: Only one provider can have this option enabled at a time. Defaults to `true`.
   */
  enableConditionalUI: boolean
  /**
   * Version of SimpleWebAuthn browser script to load in the sign in page.
   *
   * This is only loaded if the provider has conditional UI enabled. If set to false, it won't load any script.
   * Defaults to `v9.0.0`.
   */
  simpleWebAuthnBrowserVersion: SemverString | false
  /** Form fields displayed in the default Passkey sign in/up form.
   * These are not validated or enforced beyond the default Auth.js authentication page.
   *
   * By default it displays an email field.
   */
  formFields: Record<string, CredentialInput>
  /**
   * Authentication options that are passed to @simplewebauthn during authentication.
   */
  authenticationOptions?: Partial<ConfigurableAuthenticationOptions>
  /**
   * Registration options that are passed to @simplewebauthn during registration.
   */
  registrationOptions: Partial<ConfigurableRegistrationOptions>
  /**
   * Verify Authentication options that are passed to @simplewebauthn during authentication.
   */
  verifyAuthenticationOptions?: Partial<ConfigurableVerifyAuthenticationOptions>
  /**
   * Verify Registration options that are passed to @simplewebauthn during registration.
   */
  verifyRegistrationOptions?: Partial<ConfigurableVerifyRegistrationOptions>
  /**
   * Function that returns the user info that the authenticator will use during registration and authentication.
   *
   * - It accepts the provider options, the request object, and returns the user info.
   * - If the request contains an existing user's data (e.g. email address), the function must return the existing user and `exists` must be `true`.
   * - If the request contains enough information to create a new user, the function must return a new user info and `exists` must be `false`.
   * - If the request does not contain enough information to create a new user, the function must return `null`.
   *
   * It should not have any side effects (i.e. it shall not modify the database).
   *
   * During passkey creation:
   *  - The passkey's user ID will be a random string.
   *  - The passkey's user name will be user.email
   *  - The passkey's user display name will be user.name, if present, or user.email
   *
   * By default, it looks for and uses the "email" request parameter to look up the user in the database.
   */
  getUserInfo: GetUserInfo
  /** SimpleWebAuthn instance to use for registration and authentication. */
  simpleWebAuthn: {
    verifyAuthenticationResponse: typeof verifyAuthenticationResponse
    verifyRegistrationResponse: typeof verifyRegistrationResponse
    generateAuthenticationOptions: typeof generateAuthenticationOptions
    generateRegistrationOptions: typeof generateRegistrationOptions
  }
}

/**
 * Add WebAuthn login to your page.
 *
 * ### Setup
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import WebAuthn from "@auth/core/providers/webauthn"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [WebAuthn],
 * })
 * ```
 * ### Resources
 *
 * - [SimpleWebAuthn - Server side](https://simplewebauthn.dev/docs/packages/server)
 * - [SimpleWebAuthn - Client side](https://simplewebauthn.dev/docs/packages/client)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/webauthn.ts)
 *
 * :::tip
 *
 * The WebAuthn provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/webauthn.ts).
 * To override the defaults for your use case, check out [customizing the built-in WebAuthn provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function WebAuthn(
  config: Partial<WebAuthnConfig>
): WebAuthnConfig {
  return {
    id: "webauthn",
    name: "WebAuthn",
    enableConditionalUI: true,
    simpleWebAuthn: {
      generateAuthenticationOptions,
      generateRegistrationOptions,
      verifyAuthenticationResponse,
      verifyRegistrationResponse,
    },
    authenticationOptions: { timeout: DEFAULT_WEBAUTHN_TIMEOUT },
    registrationOptions: { timeout: DEFAULT_WEBAUTHN_TIMEOUT },
    formFields: {
      email: {
        label: "Email",
        required: true,
        autocomplete: "username webauthn",
      },
    },
    simpleWebAuthnBrowserVersion: DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION,
    getUserInfo,
    getRelayingParty,
    ...config,
    type: "webauthn",
  }
}

/**
 * Retrieves user information for the WebAuthn provider.
 *
 * It looks for the "email" query parameter and uses it to look up the user in the database.
 * It also accepts a "name" query parameter to set the user's display name.
 *
 * @param options - The internaloptions object.
 * @param request - The request object containing the query parameters.
 * @returns The existing or new user info.
 * @throws {MissingAdapter} If the adapter is missing.
 * @throws {EmailSignInError} If the email address is not provided.
 */
const getUserInfo: GetUserInfo = async (options, request) => {
  const { adapter } = options
  if (!adapter)
    throw new MissingAdapter(
      "WebAuthn provider requires a database adapter to be configured."
    )

  // Get email address from the query.
  const { query, body, method } = request
  const email = (method === "POST" ? body?.email : query?.email) as unknown

  // If email is not provided, return null
  if (!email || typeof email !== "string") return null

  const existingUser = await adapter.getUserByEmail(email)
  if (existingUser) {
    return { user: existingUser, exists: true }
  }

  // If the user does not exist, return a new user info.
  return { user: { email }, exists: false }
}

/**
 * Retrieves the relaying party information based on the provided options.
 * If the relaying party information is not provided, it falls back to using the URL information.
 */
function getRelayingParty(
  /** The options object containing the provider and URL information. */
  options: InternalOptions<WebAuthnProviderType>
): RelayingParty {
  const { provider, url } = options
  const { relayingParty } = provider

  const id = Array.isArray(relayingParty?.id)
    ? relayingParty.id[0]
    : relayingParty?.id

  const name = Array.isArray(relayingParty?.name)
    ? relayingParty.name[0]
    : relayingParty?.name
  const origin = Array.isArray(relayingParty?.origin)
    ? relayingParty.origin[0]
    : relayingParty?.origin

  return {
    id: id ?? url.hostname,
    name: name ?? url.host,
    origin: origin ?? url.origin,
  }
}

export type WebAuthnRegister = Awaited<
  ReturnType<typeof generateRegistrationOptions>
> & { action: "register" }
export type WebAuthnAuthenticate = Awaited<
  ReturnType<typeof generateAuthenticationOptions>
> & { action: "authenticate" }

export type WebAuthnAction = "register" | "authenticate"

export type WebAuthnOptionsResponseBody<
  T extends WebAuthnAction = WebAuthnAction,
> = T extends "register"
  ? WebAuthnRegister
  : T extends "authenticate"
    ? WebAuthnAuthenticate
    : never

type InternalOptionsWebAuthn = InternalOptions<WebAuthnProviderType> & {
  adapter: Required<Adapter>
}

type WebAuthnOptionsResponse<T extends WebAuthnAction> = ResponseInternal & {
  body: WebAuthnOptionsResponseBody<T>
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
): Promise<WebAuthnOptionsResponse<"register">> {
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
    body: { ...regOptions, action: "register" as const },
    headers: {
      "Content-Type": "application/json",
    },
  }
}

const WEBAUTHN_CHALLENGE_MAX_AGE = 60 * 15 // 15 minutes in seconds
type WebAuthnChallengeCookie = { challenge: string; registerData?: User }
export const webauthnChallenge = {
  async create(
    options: InternalOptions<WebAuthnProviderType>,
    challenge: string,
    registerData?: User
  ) {
    const maxAge = WEBAUTHN_CHALLENGE_MAX_AGE
    const data: WebAuthnChallengeCookie = { challenge, registerData }
    const cookie = await signCookie(
      "webauthnChallenge",
      JSON.stringify(data),
      maxAge,
      options
    )
    return { cookie }
  },

  /**
   * Returns challenge if present,
   */
  async use(
    options: InternalOptions<WebAuthnProviderType>,
    cookies: RequestInternal["cookies"],
    resCookies: Cookie[]
  ): Promise<WebAuthnChallengeCookie> {
    const challenge = cookies?.[options.cookies.webauthnChallenge.name]

    if (!challenge) throw new InvalidCheck("Challenge cookie missing.")

    const value = await decode<CheckPayload>({
      ...options.jwt,
      token: challenge,
      salt: options.cookies.webauthnChallenge.name,
    })

    if (!value?.value)
      throw new InvalidCheck("Challenge value could not be parsed.")

    // Clear the pkce code verifier cookie after use
    const cookie = {
      name: options.cookies.webauthnChallenge.name,
      value: "",
      options: { ...options.cookies.webauthnChallenge.options, maxAge: 0 },
    }
    resCookies.push(cookie)

    return JSON.parse(value.value) as WebAuthnChallengeCookie
  },
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
): Promise<WebAuthnOptionsResponse<"authenticate">> {
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
    body: { ...authOptions, action: "authenticate" as const },
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
    throw new AuthError("Invalid WebAuthn Authentication response.")
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
      "WebAuthn authentication response could not be verified."
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
    throw new AuthError("Invalid WebAuthn Registration response.")
  }

  // Get challenge from request cookies
  const { challenge: expectedChallenge, registerData: user } =
    await webauthnChallenge.use(options, request.cookies, resCookies)
  if (!user) {
    throw new AuthError(
      "Missing user registration data in WebAuthn challenge cookie."
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
      "WebAuthn registration response could not be verified."
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

/** @internal */
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

/** @internal */
export function fromBase64(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, "base64"))
}

/** @internal */
export function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64")
}

/** @internal */
export function transportsToString(
  transports: InternalAuthenticator["transports"]
) {
  return transports?.join(",")
}

/** @internal */
export function stringToTransports(
  tstring: string | undefined
): InternalAuthenticator["transports"] {
  return tstring
    ? (tstring.split(",") as InternalAuthenticator["transports"])
    : undefined
}
