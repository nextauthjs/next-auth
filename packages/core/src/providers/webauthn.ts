import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import { MissingAdapter } from "../errors.js"

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
} from "../types.js"

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
 * To override the defaults for your use case, check out [customizing the built-in WebAuthn provider](https://authjs.dev/guides/configuring-oauth-providers).
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
      "WebAuthn provider requires a database adapter to be configured"
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
