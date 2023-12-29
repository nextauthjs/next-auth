/**
 * Auth.js can be integrated with _any_ data layer (database, ORM, or backend API, HTTP client)
 * in order to automatically create users, handle account linking automatically, support passwordless login,
 * and to store session information.
 *
 * This module contains utility functions and types to create an Auth.js compatible adapter.
 *
 * Auth.js supports 2 session strategies to persist the login state of a user.
 * The default is to use a cookie + {@link https://authjs.dev/concepts/session-strategies#jwt JWT}
 * based session store (`strategy: "jwt"`),
 * but you can also use a database adapter to store the session in a database.
 *
 * Before you continue, Auth.js has a list of {@link https://authjs.dev/reference/core/getting-started/adapters official database adapters}. If your database is listed there, you
 * probably do not need to create your own. If you are using a data solution that cannot be integrated with an official adapter, this module will help you create a compatible adapter.
 *
 * :::caution Note
 * Although `@auth/core` _is_ framework/runtime agnostic, an adapter might rely on a client/ORM package,
 * that is not yet compatible with your framework/runtime (e.g. it might rely on [Node.js APIs](https://nodejs.org/docs/latest/api)).
 * Related issues should be reported to the corresponding package maintainers.
 * :::
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * Then, you can import this submodule from `@auth/core/adapters`.
 *
 * ## Usage
 *
 * Each adapter method and its function signature is documented in the {@link Adapter} interface.
 *
 * ```ts title=my-adapter.ts
 * import { type Adapter } from "@auth/core/adapters"
 *
 * // 1. Simplest form, a plain object.
 * export const MyAdapter: Adapter {
 *  // implement the adapter methods here
 * }
 *
 * // or
 *
 * // 2. A function that returns an object. Official adapters use this pattern.
 * export function MyAdapter(config: any): Adapter {
 *  // Instantiate a client/ORM here with the provided config, or pass it in as a parameter.
 *  // Usually, you might already have a client instance elsewhere in your application,
 *  // so you should only create a new instance if you need to or you don't have one.
 *
 *  return {
 *    // implement the adapter methods
 *  }
 * }
 *
 * ```
 *
 * Then, you can pass your adapter to Auth.js as the `adapter` option.
 *
 * ```ts title=index.ts
 * import { MyAdapter } from "./my-adapter"
 *
 * const response = await Auth(..., {
 *   adapter: MyAdapter, // 1.
 *   // or
 *   adapter: MyAdapter({ /* config *\/ }), // 2.
 *   ...
 * })
 * ```
 *
 * Note, you might be able to tweak an existing adapter to work with your data layer, instead of creating one from scratch.
 *
 * ```ts title=my-adapter.ts
 * import { type Adapter } from "@auth/core/adapters"
 * import { PrismaAdapter } from "@auth/prisma-adapter"
 * import { PrismaClient } from "@prisma/client"
 *
 * const prisma = new PrismaClient()
 *
 * const adapter: Adapter = {
 *   ...PrismaAdapter(prisma),
 *   // Add your custom methods here
 * }
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, { adapter, ... })
 * ```
 *
 * ## Models
 *
 * Auth.js can be used with any database. Models tell you what structures Auth.js expects from your database. Models will vary slightly depending on which adapter you use, but in general, will have a similar structure to the graph below. Each model can be extended with additional fields.
 *
 * :::note
 * Auth.js / NextAuth.js uses `camelCase` for its database rows while respecting the conventional `snake_case` formatting for OAuth-related values. If the mixed casing is an issue for you, most adapters have a dedicated documentation section on how to force a casing convention.
 * :::
 *
 * ```mermaid
 * erDiagram
 *     User ||--|{ Account : ""
 *     User {
 *       string id
 *       string name
 *       string email
 *       timestamp emailVerified
 *       string image
 *     }
 *     User ||--|{ Session : ""
 *     Session {
 *       string id
 *       timestamp expires
 *       string sessionToken
 *       string userId
 *     }
 *     Account {
 *       string id
 *       string userId
 *       string type
 *       string provider
 *       string providerAccountId
 *       string refresh_token
 *       string access_token
 *       int expires_at
 *       string token_type
 *       string scope
 *       string id_token
 *       string session_state
 *     }
 *     User ||--|{ VerificationToken : ""
 *     VerificationToken {
 *       string identifier
 *       string token
 *       timestamp expires
 *     }
 * ```
 *
 * ## Testing
 *
 * There is a test suite [available](https://github.com/nextauthjs/next-auth/tree/main/packages/utils/adapter/index.ts)
 * to ensure that your adapter is compatible with Auth.js.
 *
 * ## Known issues
 *
 * The following are missing built-in features in Auth.js but can be solved in user land. If you would like to help implement these features, please reach out.
 *
 * ### Token rotation
 *
 * Auth.js _currently_ does not support {@link https://authjs.dev/concepts/oauth#token-rotation `access_token` rotation} out of the box.
 * The necessary information (`refresh_token`, expiry, etc.) is being stored in the database, but the logic to rotate the token is not implemented
 * in the core library.
 * [This guide](https://authjs.dev/guides/basics/refresh-token-rotation#database-strategy) should provide the necessary steps to do this in user land.
 *
 * ### Federated logout
 *
 * Auth.js _currently_ does not support {@link https://authjs.dev/concepts/oauth#federated-logout federated logout} out of the box.
 * This means that even if an active session is deleted from the database, the user will still be signed in to the identity provider,
 * they will only be signed out of the application.
 * Eg. if you use Google as an identity provider, and you delete the session from the database,
 * the user will still be signed in to Google, but they will be signed out of your application.
 *
 * If your users might be using the application from a publicly shared computer (eg: library), you might want to implement federated logout.
 * {@link https://authjs.dev/guides/providers/federated-logout This guide} should provide the necessary steps.
 *
 * @module adapters
 */

import { ProviderType } from "./providers/index.js"
import type { Account, Awaitable, User } from "./types.js"
// TODO: Discuss if we should expose methods to serialize and deserialize
// the data? Many adapters share this logic, so it could be useful to
// have a common implementation.

/**
 * A user represents a person who can sign in to the application.
 * If a user does not exist yet, it will be created when they sign in for the first time,
 * using the information (profile data) returned by the identity provider.
 * A corresponding account is also created and linked to the user.
 */
export interface AdapterUser extends User {
  /** A unique identifier for the user. */
  id: string
  /** The user's email address. */
  email: string
  /**
   * Whether the user has verified their email address via an [Email provider](https://authjs.dev/reference/core/providers/email).
   * It is `null` if the user has not signed in with the Email provider yet, or the date of the first successful signin.
   */
  emailVerified: Date | null
}

/**
 * An account is a connection between a user and a provider.
 *
 * There are two types of accounts:
 * - OAuth/OIDC accounts, which are created when a user signs in with an OAuth provider.
 * - Email accounts, which are created when a user signs in with an [Email provider](https://authjs.dev/reference/core/providers/email).
 *
 * One user can have multiple accounts.
 */
export interface AdapterAccount extends Account {
  userId: string
  type: Extract<ProviderType, "oauth" | "oidc" | "email">
}

/**
 * A session holds information about a user's current signin state.
 */
export interface AdapterSession {
  /**
   * A randomly generated value that is used to look up the session in the database
   * when using `"database"` `AuthConfig.strategy` option.
   * This value is saved in a secure, HTTP-Only cookie on the client.
   */
  sessionToken: string
  /** Connects the active session to a user in the database */
  userId: string
  /**
   * The absolute date when the session expires.
   *
   * If a session is accessed prior to its expiry date,
   * it will be extended based on the `maxAge` option as defined in by `SessionOptions.maxAge`.
   * It is never extended more than once in a period defined by `SessionOptions.updateAge`.
   *
   * If a session is accessed past its expiry date,
   * it will be removed from the database to clean up inactive sessions.
   *
   */
  expires: Date
}

/**
 * A verification token is a temporary token that is used to sign in a user via their email address.
 * It is created when a user signs in with an [Email provider](https://authjs.dev/reference/core/providers/email).
 * When the user clicks the link in the email, the token and email is sent back to the server
 * where it is hashed and compared to the value in the database.
 * If the tokens and emails match, and the token hasn't expired yet, the user is signed in.
 * The token is then deleted from the database.
 */
export interface VerificationToken {
  /** The user's email address. */
  identifier: string
  /** The absolute date when the token expires. */
  expires: Date
  /**
   * A [hashed](https://authjs.dev/concepts/hashing) token, using the `AuthConfig.secret` value.
   */
  token: string
}

/**
 * An adapter is an object with function properties (methods) that read and write data from a data source.
 * Think of these methods as a way to normalize the data layer to common interfaces that Auth.js can understand.
 *
 * This is what makes Auth.js very flexible and allows it to be used with any data layer.
 *
 * The adapter methods are used to perform the following operations:
 * - Create/update/delete a user
 * - Link/unlink an account to/from a user
 * - Handle active sessions
 * - Support passwordless authentication across multiple devices
 *
 * :::note
 * If any of the methods are not implemented, but are called by Auth.js,
 * an error will be shown to the user and the operation will fail.
 * :::
 */
export interface Adapter {
  /**
   * Creates a user in the database and returns it.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  createUser?(user: AdapterUser): Awaitable<AdapterUser>
  /**
   * Returns a user from the database via the user id.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  getUser?(id: string): Awaitable<AdapterUser | null>
  /**
   * Returns a user from the database via the user's email address.
   *
   * See also [Verification tokens](https://authjs.dev/guides/adapters/creating-a-database-adapter#verification-tokens)
   */
  getUserByEmail?(email: string): Awaitable<AdapterUser | null>
  /**
   * Using the provider id and the id of the user for a specific account, get the user.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  getUserByAccount?(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Awaitable<AdapterUser | null>
  /**
   * Updates a user in the database and returns it.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  updateUser?(
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">
  ): Awaitable<AdapterUser>
  /**
   * @todo This method is currently not invoked yet.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  deleteUser?(
    userId: string
  ): Promise<void> | Awaitable<AdapterUser | null | undefined>
  /**
   * This method is invoked internally (but optionally can be used for manual linking).
   * It creates an [Account](https://authjs.dev/reference/core/adapters#models) in the database.
   *
   * See also [User management](https://authjs.dev/guides/adapters/creating-a-database-adapter#user-management)
   */
  linkAccount?(
    account: AdapterAccount
  ): Promise<void> | Awaitable<AdapterAccount | null | undefined>
  /** @todo This method is currently not invoked yet. */
  unlinkAccount?(
    providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
  ): Promise<void> | Awaitable<AdapterAccount | undefined>
  /**
   * Creates a session for the user and returns it.
   *
   * See also [Database Session management](https://authjs.dev/guides/adapters/creating-a-database-adapter#database-session-management)
   */
  createSession?(session: {
    sessionToken: string
    userId: string
    expires: Date
  }): Awaitable<AdapterSession>
  /**
   * Returns a session and a userfrom the database in one go.
   *
   * :::tip
   * If the database supports joins, it's recommended to reduce the number of database queries.
   * :::
   *
   * See also [Database Session management](https://authjs.dev/guides/adapters/creating-a-database-adapter#database-session-management)
   */
  getSessionAndUser?(
    sessionToken: string
  ): Awaitable<{ session: AdapterSession; user: AdapterUser } | null>
  /**
   * Updates a session in the database and returns it.
   *
   * See also [Database Session management](https://authjs.dev/guides/adapters/creating-a-database-adapter#database-session-management)
   */
  updateSession?(
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ): Awaitable<AdapterSession | null | undefined>
  /**
   * Deletes a session from the database. It is preferred that this method also
   * returns the session that is being deleted for logging purposes.
   *
   * See also [Database Session management](https://authjs.dev/guides/adapters/creating-a-database-adapter#database-session-management)
   */
  deleteSession?(
    sessionToken: string
  ): Promise<void> | Awaitable<AdapterSession | null | undefined>
  /**
   * Creates a verification token and returns it.
   *
   * See also [Verification tokens](https://authjs.dev/guides/adapters/creating-a-database-adapter#verification-tokens)
   */
  createVerificationToken?(
    verificationToken: VerificationToken
  ): Awaitable<VerificationToken | null | undefined>
  /**
   * Return verification token from the database and deletes it
   * so it can only be used once.
   *
   * See also [Verification tokens](https://authjs.dev/guides/adapters/creating-a-database-adapter#verification-tokens)
   */
  useVerificationToken?(params: {
    identifier: string
    token: string
  }): Awaitable<VerificationToken | null>
}

// For compatibility with older versions of NextAuth.js
// @ts-expect-error
declare module "next-auth/adapters" {
  type JsonObject = {
    [Key in string]?: JsonValue
  }
  type JsonArray = JsonValue[]
  type JsonPrimitive = string | number | boolean | null
  type JsonValue = JsonPrimitive | JsonObject | JsonArray
  interface AdapterAccount {
    type: "oauth" | "email" | "oidc"
    [key: string]: JsonValue | undefined
  }
}
