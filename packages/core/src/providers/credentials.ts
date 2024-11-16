import type { CommonProviderOptions } from "./index.js"
import type { Awaitable, User } from "../types.js"
import type { JSX } from "preact"

/**
 * Besides providing type safety inside {@link CredentialsConfig.authorize}
 * it also determines how the credentials input fields will be rendered
 * on the default sign in page.
 */
export interface CredentialInput
  extends Partial<JSX.IntrinsicElements["input"]> {
  label?: string
}

/** The Credentials Provider needs to be configured. */
export interface CredentialsConfig<
  CredentialsInputs extends Record<string, CredentialInput> = Record<
    string,
    CredentialInput
  >,
> extends CommonProviderOptions {
  type: "credentials"
  credentials: CredentialsInputs
  /**
   * Gives full control over how you handle the credentials received from the user.
   *
   * :::warning
   * There is no validation on the user inputs by default, so make sure you do so
   * by a popular library like [Zod](https://zod.dev)
   * :::
   *
   * This method expects a `User` object to be returned for a successful login.
   *
   * If an `CredentialsSignin` is thrown or `null` is returned, two things can happen:
   * 1. The user is redirected to the login page, with `error=CredentialsSignin&code=credentials` in the URL. `code` is configurable, see below.
   * 2. If you throw this error in a framework that handles form actions server-side, this error is thrown by the login form action, so you'll need to handle it there.
   *
   * In case of 1., generally, we recommend not hinting if the user for example gave a wrong username or password specifically,
   * try rather something like "invalid-credentials". Try to be as generic with client-side errors as possible.
   *
   * To customize the error code, you can create a custom error that extends {@link CredentialsSignin} and throw it in `authorize`.
   *
   * @example
   * ```ts
   * class CustomError extends CredentialsSignin {
   *  code = "custom_error"
   * }
   * // URL will contain `error=CredentialsSignin&code=custom_error`
   * ```
   *
   * @example
   * ```ts
   * async authorize(credentials, request) { // you have access to the original request as well
   *   if(!isValidCredentials(credentials)) {
   *      throw new CustomError()
   *   }
   *   return await getUser(credentials) // assuming it returns a User or null
   * }
   * ```
   */
  authorize: (
    /**
     * The available keys are determined by {@link CredentialInput}.
     *
     * @note The existence/correctness of a field cannot be guaranteed at compile time,
     * so you should always validate the input before using it.
     *
     * You can add basic validation depending on your use case,
     * or you can use a popular library like [Zod](https://zod.dev) for example.
     */
    credentials: Partial<Record<keyof CredentialsInputs, unknown>>,
    /** The original request. */
    request: Request
  ) => Awaitable<User | null>
}

export type CredentialsProviderId = "credentials"

/**
 * The Credentials provider allows you to handle signing in with arbitrary credentials,
 * such as a username and password, domain, or two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).
 *
 * It is intended to support use cases where you have an existing system you need to authenticate users against.
 *
 * It comes with the constraint that users authenticated in this manner are not persisted in the database,
 * and consequently that the Credentials provider can only be used if JSON Web Tokens are enabled for sessions.
 *
 * :::caution
 * The functionality provided for credentials-based authentication is intentionally limited to discourage the use of passwords due to the inherent security risks of the username-password model.
 *
 * OAuth providers spend significant amounts of money, time, and engineering effort to build:
 *
 * - abuse detection (bot-protection, rate-limiting)
 * - password management (password reset, credential stuffing, rotation)
 * - data security (encryption/salting, strength validation)
 *
 * and much more for authentication solutions. It is likely that your application would benefit from leveraging these battle-tested solutions rather than try to rebuild them from scratch.
 *
 * If you'd still like to build password-based authentication for your application despite these risks, Auth.js gives you full control to do so.
 *
 * :::
 *
 * See the [callbacks documentation](/reference/core#authconfig#callbacks) for more information on how to interact with the token. For example, you can add additional information to the token by returning an object from the `jwt()` callback:
 *
 * ```ts
 * callbacks: {
 *   async jwt({ token, user, account, profile, isNewUser }) {
 *     if (user) {
 *       token.id = user.id
 *     }
 *     return token
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * import { Auth } from "@auth/core"
 * import Credentials from "@auth/core/providers/credentials"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [
 *     Credentials({
 *       credentials: {
 *         username: { label: "Username" },
 *         password: {  label: "Password", type: "password" }
 *       },
 *       async authorize({ request }) {
 *         const response = await fetch(request)
 *         if(!response.ok) return null
 *         return await response.json() ?? null
 *       }
 *     })
 *   ],
 *   secret: "...",
 *   trustHost: true,
 * })
 * ```
 * @see [Username/Password Example](https://authjs.dev/getting-started/authentication/credentials)
 */
export default function Credentials<
  CredentialsInputs extends Record<string, CredentialInput> = Record<
    string,
    CredentialInput
  >,
>(config: Partial<CredentialsConfig<CredentialsInputs>>): CredentialsConfig {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {},
    authorize: () => null,
    // @ts-expect-error
    options: config,
  }
}
