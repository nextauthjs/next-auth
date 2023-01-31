import { type Record as PBRecord } from "pocketbase"

export interface loginOpts {
  username: string
  password: string
}

export type PocketBaseUser = PBRecord & {
  name: string
  image: string
  email: string
  emailVerified: string
  code?: number
}

export type PocketBaseSession = PBRecord & {
  expires: string
  sessionToken: string
  userId: string
  code?: number
}

export type PocketBaseAccount = PBRecord & {
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string
  access_token: string
  expires_at: string
  token_type: string
  scope: string
  id_token: string
  session_state: string
  oauth_token_secret: string
  oauth_token: string
  code?: number
}

export type PocketBaseVerificationToken = PBRecord & {
  identifier: string
  token: string
  expires: string
  code?: number
}
