import { Account, User, Awaitable } from "."
import type { Adapter as FutureAdapter } from "@auth/core/adapters"

export interface AdapterUser extends User {
  id: string
  email: string
  emailVerified: Date | null
}

export interface AdapterAccount extends Account {
  userId: string
}

export interface AdapterSession {
  /** A randomly generated value that is used to get hold of the session. */
  sessionToken: string
  /** Used to connect the session to a particular user */
  userId: string
  expires: Date
}

export interface VerificationToken {
  identifier: string
  expires: Date
  token: string
}

/**
 * Using a custom adapter you can connect to any database backend or even several different databases.
 * Custom adapters created and maintained by our community can be found in the adapters repository.
 * Feel free to add a custom adapter from your project to the repository,
 * or even become a maintainer of a certain adapter.
 * Custom adapters can still be created and used in a project without being added to the repository.
 *
 * **Required methods**
 *
 * _(These methods are required for all sign in flows)_
 * - `createUser`
 * - `getUser`
 * - `getUserByEmail`
 * - `getUserByAccount`
 * - `linkAccount`
 * - `createSession`
 * - `getSessionAndUser`
 * - `updateSession`
 * - `deleteSession`
 * - `updateUser`
 *
 * _(Required to support email / passwordless sign in)_
 *
 * - `createVerificationToken`
 * - `useVerificationToken`
 *
 * **Unimplemented methods**
 *
 * _(These methods will be required in a future release, but are not yet invoked)_
 * - `deleteUser`
 * - `unlinkAccount`
 *
 * [Adapters Overview](https://next-auth.js.org/adapters/overview) |
 * [Create a custom adapter](https://next-auth.js.org/tutorials/creating-a-database-adapter)
 */
export interface Adapter {
  createUser?:
    | FutureAdapter["createUser"]
    | ((user: Omit<AdapterUser, "id">) => Awaitable<AdapterUser>)
  getUser?: (id: string) => Awaitable<AdapterUser | null>
  getUserByEmail?: (email: string) => Awaitable<AdapterUser | null>
  /** Using the provider id and the id of the user for a specific account, get the user. */
  getUserByAccount?: (
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ) => Awaitable<AdapterUser | null>
  updateUser?: (
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">
  ) => Awaitable<AdapterUser>
  /** @todo Implement */
  deleteUser?: (
    userId: string
  ) => Promise<void> | Awaitable<AdapterUser | null | undefined>
  linkAccount?:
    | FutureAdapter["linkAccount"]
    | ((
        account: AdapterAccount,
      ) => Promise<void> | Awaitable<AdapterAccount | null | undefined>)
  /** @todo Implement */
  unlinkAccount?:
    | FutureAdapter["unlinkAccount"]
    | ((
        providerAccountId: Pick<
          AdapterAccount,
          "provider" | "providerAccountId"
        >,
      ) => Promise<void> | Awaitable<AdapterAccount | undefined>)
  /** Creates a session for the user and returns it. */
  createSession?: (session: {
    sessionToken: string
    userId: string
    expires: Date
  }) => Awaitable<AdapterSession>
  getSessionAndUser?: (
    sessionToken: string
  ) => Awaitable<{ session: AdapterSession; user: AdapterUser } | null>
  updateSession?: (
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ) => Awaitable<AdapterSession | null | undefined>
  /**
   * Deletes a session from the database.
   * It is preferred that this method also returns the session
   * that is being deleted for logging purposes.
   */
  deleteSession?: (
    sessionToken: string
  ) => Promise<void> | Awaitable<AdapterSession | null | undefined>
  createVerificationToken?: (
    verificationToken: VerificationToken
  ) => Awaitable<VerificationToken | null | undefined>
  /**
   * Return verification token from the database
   * and delete it so it cannot be used again.
   */
  useVerificationToken?: (params: {
    identifier: string
    token: string
  }) => Awaitable<VerificationToken | null>
}
