import { AppOptions } from "./internals"
import { User, Profile, Session } from "."
import { EmailConfig, SendVerificationRequest } from "./providers"
import { ConnectionOptions } from "typeorm"

/** Legacy */
declare const Adapters: {
  Default: Adapter<ConnectionOptions>
  TypeORM: { Adapter: Adapter<ConnectionOptions> }
  Prisma: { Adapter: Adapter }
}
export default Adapters

/**
 * Using a custom adapter you can connect to any database backend or even several different databases.
 * Custom adapters created and maintained by our community can be found in the adapters repository.
 * Feel free to add a custom adapter from your project to the repository,
 * or even become a maintainer of a certain adapter.
 * Custom adapters can still be created and used in a project without being added to the repository.
 *
 * [Community adapters](https://github.com/nextauthjs/adapters) |
 * [Create a custom adapter](https://next-auth.js.org/tutorials/creating-a-database-adapter)
 */
export interface AdapterInstance<U = User, P = Profile, S = Session> {
  createUser(profile: P): Promise<U>
  getUser(id: string): Promise<U | null>
  getUserByEmail(email: string): Promise<U | null>
  getUserByProviderAccountId(
    providerId: string,
    providerAccountId: string
  ): Promise<U | null>
  updateUser(user: U): Promise<U>
  /** @todo Implement */
  deleteUser?(userId: string): Promise<void>
  linkAccount(
    userId: string,
    providerId: string,
    providerType: string,
    providerAccountId: string,
    refreshToken?: string,
    accessToken?: string,
    accessTokenExpires?: null
  ): Promise<void>
  /** @todo Implement */
  unlinkAccont?(
    userId: string,
    providerId: string,
    providerAccountId: string
  ): Promise<void>
  createSession(user: U): Promise<S>
  getSession(sessionToken: string): Promise<S | null>
  updateSession(session: S, force?: boolean): Promise<S>
  deleteSession(sessionToken: string): Promise<void>
  createVerificationRequest?: SendVerificationRequest
  getVerificationRequest?(
    identifier: string,
    verificationToken: string,
    secret: string,
    provider: Required<EmailConfig>
  ): Promise<{
    id: string
    identifier: string
    token: string
    expires: Date
  } | null>
  deleteVerificationRequest?(
    identifier: string,
    verificationToken: string,
    secret: string,
    provider: Required<EmailConfig>
  ): Promise<void>
}

/**
 * From an implementation perspective, an adapter in NextAuth.js is a function
 * which returns an async `getAdapter()` method, which in turn returns a list of functions
 * used to handle operations such as creating user, linking a user
 * and an OAuth account or handling reading and writing sessions.
 *
 * It uses this approach to allow database connection logic to live in the `getAdapter()` method.
 * By calling the function just before an action needs to happen,
 * it is possible to check database connection status and handle connecting / reconnecting
 * to a database as required.
 *
 * **Required methods**
 *
 * _(These methods are required for all sign in flows)_
 * - `createUser`
 * - `getUser`
 * - `getUserByEmail`
 * - `getUserByProviderAccountId`
 * - `linkAccount`
 * - `createSession`
 * - `getSession`
 * - `updateSession`
 * - `deleteSession`
 * - `updateUser`
 *
 * _(Required to support email / passwordless sign in)_
 *
 * - `createVerificationRequest`
 * - `getVerificationRequest`
 * - `deleteVerificationRequest`
 *
 * **Unimplemented methods**
 *
 * _(These methods will be required in a future release, but are not yet invoked)_
 * - `deleteUser`
 * - `unlinkAccount`
 *
 * [Community adapters](https://github.com/nextauthjs/adapters) |
 * [Create a custom adapter](https://next-auth.js.org/tutorials/creating-a-database-adapter)
 */
export type Adapter<
  C = Record<string, unknown>,
  O = Record<string, unknown>,
  U = User,
  P = Profile,
  S = Session
> = (
  config: C,
  options?: O
) => {
  getAdapter(appOptions: AppOptions): Promise<AdapterInstance<U, P, S>>
}
