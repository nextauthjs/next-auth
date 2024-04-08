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
  nextauth_users: NextauthUser
  nextauth_accounts: NextauthAccount
  nextauth_verificationTokens: NextauthVerificationToken
  nextauth_users_accounts: NextauthUsersAccount
  nextauth_users_sessions: NextauthUsersSession
  nextauth_sessions: NextauthSession
}

const tables = [
  "nextauth_users",
  "nextauth_accounts",
  "nextauth_verificationTokens",
  "nextauth_users_accounts",
  "nextauth_users_sessions",
  "nextauth_sessions",
]

const DatabaseClient = buildClient() as ClientConstructor<any>

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ databaseURL: "", ...options }, tables)
  }
}
