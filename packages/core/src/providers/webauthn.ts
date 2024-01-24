import type { CommonProviderOptions, ProviderType, CredentialInput } from "."
import type { GenerateRegistrationOptionsOpts, GenerateAuthenticationOptionsOpts, VerifyAuthenticationResponseOpts, VerifyRegistrationResponseOpts } from "@simplewebauthn/server"
import type { InternalOptions, RequestInternal } from "../types"
import type { AdapterUser } from "../adapters"
import { EmailSignInError, MissingAdapter } from "../errors"
import { randomString } from "../lib/utils/web"


export type WebAuthnProviderType = "webauthn"

// Validate that a string is a valid semver version number.
type SemverString = `v${number}` | `v${number}.${number}` | `v${number}.${number}.${number}`
function isSemverString(version: string): version is SemverString {
    return /^v\d+(?:\.\d+){0,2}$/.test(version)
}

export const DEFAULT_WEBAUTHN_TIMEOUT = 5 * 60 * 1000 // 5 minutes
export const DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION: SemverString = "v9.0.0"

type RelayingParty = {
    /** Relaying Party ID. Use the website's domain name. */
    id: string
    /** Relaying Party name. Use the website's name. */
    name: string
    /** Relaying Party origin. Use the website's origin. */
    origin: string
}

export type UserInfo = {
    /** User's website-specific unique ID. It is stored by the authenticator during registration.
     * This ID:
     * - Must be unique in the database.
     * - Must not contain personally identifiable information.
     * - Should be an opaque value.
     * - Should be random or pseudorandom.
     * - Must never change throughout the user's lifetime with the service.
     */
    userID: string
    /** User's website-specific username (email, username, phone number, etc...).
     * It is provided by the client during authentication to look up the user's credentials in the database.
     * This value:
     * - Must be unique in the database.
     * - May contain personally identifiable information.
     * - May change throughout the user's lifetime with the service.
     */
    userName: string
    /** User's preferred display name. It's only used for display purposes.
     * This value:
     * - May contain personally identifiable information.
     * - May change throughout the user's lifetime with the service.
     * - May be the same as the user's username. (default behavior)
     */
    userDisplayName?: string
}

/**
 * Function that returns the user info that the authenticator will use during registration and authentication.
 * 
 * It accepts the provider options, the request object, and the session user and returns the user info.
 * If the session user is defined, the function must return the session user info and `exists` must be `true`.
 * If the request contains an existing user's data (e.g. email address), the function must return the existing user info and `exists` must be `true`.
 * If the request contains enough information to create a new user, the function must return a new user info and `exists` must be `false`.
 * If the request does not contain enough information to create a new user, the function must throw some kind of `AuthError`
 * 
 * It should not have any side effects (i.e. it should not modify the database).
 */
export type GetUserInfo<TProviderType = ProviderType> = (
    options: InternalOptions<TProviderType>,
    request: RequestInternal,
    sessionUser: Pick<AdapterUser, "name" | "id" | "email"> | null
) => Promise<{ userInfo: UserInfo; exists: boolean }>


type ConfigurableAuthenticationOptions = Omit<GenerateAuthenticationOptionsOpts, "rpID" | "allowCredentials" | "challenge">
type ConfigurableRegistrationOptions = Omit<GenerateRegistrationOptionsOpts, "rpName" | "rpID" | "userID" | "userName" | "challenge" | "userDisplayName" | "excludeCredentials">
type ConfigurableVerifyAuthenticationOptions = Omit<VerifyAuthenticationResponseOpts, "expectedChallenge" | "expectedOrigin" | "expectedRPID" | "authenticator" | "response">
type ConfigurableVerifyRegistrationOptions = Omit<VerifyRegistrationResponseOpts, "expectedChallenge" | "expectedOrigin" | "expectedRPID" | "response">

export interface WebAuthnConfig extends CommonProviderOptions {
    type: WebAuthnProviderType
    /** Relaying party (RP) configuration */
    relayingParty: RelayingParty
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
    registrationOptions?: Partial<ConfigurableRegistrationOptions>
    /**
     * Verify Authentication options that are passed to @simplewebauthn during authentication.
     */
    verifyAuthenticationOptions?: Partial<ConfigurableVerifyAuthenticationOptions>
    /**
     * Verify Registration options that are passed to @simplewebauthn during registration.
     */
    verifyRegistrationOptions?: Partial<ConfigurableVerifyRegistrationOptions>
    /** Function called during registration to get user info.
     * 
     * By default, it uses the email address to look for the user in the database.
     * If it doesn't find the user, it will create a random user ID and use the email address as the user name and user display name.
     */
    getUserInfo: GetUserInfo<WebAuthnProviderType>
}

export type WebAuthnInputConfig = Pick<WebAuthnConfig, "relayingParty"> & Partial<WebAuthnConfig>


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
 *   providers: [WebAuthn({ relayingParty: { id: "example.com", name: "My Website", origin: "https://example.com" } })],
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
export default function WebAuthn(config: WebAuthnInputConfig): WebAuthnConfig {
    // Make sure simpleWebAuthnBrowserVersion is a valid version number.
    if (config.simpleWebAuthnBrowserVersion) {
        if (!isSemverString(config.simpleWebAuthnBrowserVersion)) {
            throw new Error("simpleWebAuthnBrowserVersion must be a valid semver version number.")
        }
    }

    return {
        id: "webauthn",
        name: "WebAuthn",
        enableConditionalUI: true,
        authenticationOptions: {
            timeout: DEFAULT_WEBAUTHN_TIMEOUT,
        },
        registrationOptions: {
            timeout: DEFAULT_WEBAUTHN_TIMEOUT,
        },
        formFields: { email: { label: "Email", required: true, autocomplete: "username webauthn" } },
        getUserInfo,
        simpleWebAuthnBrowserVersion: DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION,
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
 * @param sessionUser - The session user, if present.
 * @returns The user information including userID, userName, and userDisplayName.
 * @throws {MissingAdapter} If the adapter is missing.
 * @throws {EmailSignInError} If the email address is not provided.
 */
const getUserInfo: GetUserInfo<WebAuthnProviderType> = async (options, request, sessionUser) => {
    const { adapter } = options
    if (!adapter)
        throw new MissingAdapter(
            "Adapter not implemented."
        )

    let dbUser = sessionUser ?? null

    // If there's no session user, try to get the user from the request.
    if (!dbUser) {
        // Get email address and display name from the query.
        const { query, body, method } = request
        const email = (method === "POST" ? body?.email : query?.email) as unknown
        const displayName = (method === "POST" ? body?.name : query?.name) as unknown

        // If email is not provided, raise an error.
        if (!email || typeof email !== "string")
            throw new EmailSignInError("Email address is required.")

        // If displayName is defined but not a string, raise an error.
        if (typeof displayName !== "undefined" && typeof displayName !== "string")
            throw new EmailSignInError("Display name must be omitted or be a string.")


        dbUser = await adapter.getUserByEmail(email)

        // If the user does not exist, create a new ID and use the provided info.
        if (!dbUser) {
            return {
                userInfo: {
                    userID: randomString(16), // 32 byte string
                    userName: email,
                    userDisplayName: displayName ?? email, // Use email as display name by default.
                },
                exists: false,
            }
        }
    }

    return {
        userInfo: {
            userID: dbUser.id,
            userName: dbUser.email,
            userDisplayName: dbUser.name ?? undefined, // If the existing user has no name, don't set it.
        },
        exists: true,
    }
}

/**
 * Builds and returns the script tag to load the SimpleWebAuthn browser script.
 * @param config Provider config
 * @returns The script tag to load the SimpleWebAuthn browser script, or an empty string if the provider has no conditional UI enabled.
 */
export function getSimpleWebAuthnBrowserScriptTag(config: WebAuthnConfig) {
    const { simpleWebAuthnBrowserVersion, enableConditionalUI } = config

    if (!simpleWebAuthnBrowserVersion || !enableConditionalUI)
        return ""

    return `<script src="https://unpkg.com/@simplewebauthn/browser@${simpleWebAuthnBrowserVersion}/dist/bundle/index.es5.umd.min.js" crossorigin="anonymous"></script>`
}
