import type { Generated } from "kysely"

interface User {
  id: Generated<string>
  name: string | null
  email: string | null
  emailVerified: Date | string | null
  image: string | null
}

interface Account {
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
  oauth_token_secret: string | null
  oauth_token: string | null
}

interface Session {
  id: Generated<string>
  userId: string
  sessionToken: string
  expires: Date | string
}

interface VerificationToken {
  identifier: string
  token: string
  expires: Date | string
}

export interface Database {
  User: User
  Account: Account
  Session: Session
  VerificationToken: VerificationToken
}
