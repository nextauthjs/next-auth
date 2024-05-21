/**
 * This file is auto-generated from Xata and corresponds
 * to the database types in the Xata database. Please do not
 * augment by hand.
 */
import {
  buildClient,
  BaseClientOptions,
  XataRecord,
  ClientConstructor,
  type BaseSchema,
} from "@xata.io/client"

export interface NextauthUser {
  email?: string | null
  emailVerified?: Date | null
  name?: string | null
  image?: string | null
}

export type NextauthUserRecord = NextauthUser & XataRecord

export interface NextauthAccount {
  user?: NextauthUserRecord | null
  type?: string | null
  provider?: string | null
  providerAccountId?: string | null
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
}

export type NextauthAccountRecord = NextauthAccount & XataRecord

export interface NextauthVerificationToken {
  identifier?: string | null
  token?: string | null
  expires?: Date | null
}

export type NextauthVerificationTokenRecord = NextauthVerificationToken &
  XataRecord

export interface NextauthUsersAccount {
  user?: NextauthUserRecord | null
  account?: NextauthAccountRecord | null
}

export type NextauthUsersAccountRecord = NextauthUsersAccount & XataRecord

export interface NextauthUsersSession {
  user?: NextauthUserRecord | null
  session?: NextauthSessionRecord | null
}

export type NextauthUsersSessionRecord = NextauthUsersSession & XataRecord

export interface NextauthSession {
  sessionToken?: string | null
  expires?: Date | null
  user?: NextauthUserRecord | null
}

export type NextauthSessionRecord = NextauthSession & XataRecord

export type DatabaseSchema = {
  nextauth_users: NextauthUserRecord
  nextauth_accounts: NextauthAccountRecord
  nextauth_verificationTokens: NextauthVerificationTokenRecord
  nextauth_users_accounts: NextauthUsersAccountRecord
  nextauth_users_sessions: NextauthUsersSessionRecord
  nextauth_sessions: NextauthSessionRecord
}

const schemas: BaseSchema[] = [
  {
    name: "nextauth_users",
    columns: [
      {
        name: "email",
        type: "email",
      },
      {
        name: "emailVerified",
        type: "datetime",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "image",
        type: "string",
      },
    ],
  },
  {
    name: "nextauth_accounts",
    columns: [
      {
        name: "user",
        type: "link",
        link: {
          table: "nextauth_users",
        },
      },
      {
        name: "type",
        type: "string",
      },
      {
        name: "provider",
        type: "string",
      },
      {
        name: "providerAccountId",
        type: "string",
      },
      {
        name: "refresh_token",
        type: "string",
      },
      {
        name: "access_token",
        type: "string",
      },
      {
        name: "expires_at",
        type: "int",
      },
      {
        name: "token_type",
        type: "string",
      },
      {
        name: "scope",
        type: "string",
      },
      {
        name: "id_token",
        type: "text",
      },
      {
        name: "session_state",
        type: "string",
      },
    ],
  },
  {
    name: "nextauth_verificationTokens",
    columns: [
      {
        name: "identifier",
        type: "string",
      },
      {
        name: "token",
        type: "string",
      },
      {
        name: "expires",
        type: "datetime",
      },
    ],
  },
 {
    name: "nextauth_users_accounts",
    columns: [
      {
        name: "user",
        type: "link",
        link: {
          table: "nextauth_users",
        },
      },
      {
        name: "account",
        type: "link",
        link: {
          table: "nextauth_accounts",
        },
      },
    ],
  },
  {
    name: "nextauth_users_sessions",
    columns: [
      {
        name: "user",
        type: "link",
        link: {
          table: "nextauth_users",
        },
      },
      {
        name: "session",
        type: "link",
        link: {
          table: "nextauth_sessions",
        },
      },
    ],
  },
  {
    name: "nextauth_sessions",
    columns: [
      {
        name: "sessionToken",
        type: "string",
      },
      {
        name: "expires",
        type: "datetime",
      },
      {
        name: "user",
        type: "link",
        link: {
          table: "nextauth_users",
        },
      },
    ],
  },
]

const DatabaseClient = buildClient() as ClientConstructor<any>

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ databaseURL: "", ...options }, schemas)
  }
}
