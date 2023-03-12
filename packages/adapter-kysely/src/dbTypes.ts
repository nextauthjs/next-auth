import type { ColumnType } from "kysely"

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Account {
  id: Generated<string>
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
  user: string
}

export interface Session {
  id: Generated<string>
  sessionToken: string
  userId: string
  expires: Timestamp
}

export interface User {
  id: Generated<string>
  name: string | null
  email: string | null
  emailVerified: Timestamp | null
  image: string | null
}

export interface VerificationToken {
  identifier: string | null
  token: string | null
  expires: Timestamp | null
}

export interface DB {
  account: Account
  session: Session
  user: User
  VerificationToken: VerificationToken
}
