import {
  AdapterAccount,
  AdapterAccountType,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

export type DBUser = {
  id: string
  name: string | null
  email: string
  email_verified: Date | null
  image: string | null
}

export function fromPartialAdapterUser(
  user: Partial<AdapterUser>
): Partial<DBUser> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    email_verified: user.emailVerified,
    image: user.image,
  }
}

export function toAdapterUser(user: DBUser): AdapterUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.email_verified,
    image: user.image,
  }
}

export type DBAccount = {
  id: string
  user_id: string
  type: string
  provider: string
  provider_account_id: string
  refresh_token: string | null
  access_token: string | null
  expires_at: string | null
  id_token: string | null
  scope: string | null
  session_state: string | null
  token_type: string | null
}

export function toAdapterAccount(account: DBAccount): AdapterAccount {
  return {
    id: account.id,
    userId: account.user_id,
    type: account.type as AdapterAccountType,
    provider: account.provider,
    providerAccountId: account.provider_account_id,
    access_token: account.access_token ?? undefined,
    expires_at: account.expires_at ? parseInt(account.expires_at) : undefined,
    refresh_token: account.refresh_token ?? undefined,
    id_token: account.id_token ?? undefined,
    scope: account.scope ?? undefined,
    session_state: account.session_state ?? undefined,
    token_type:
      (account.token_type?.toLowerCase() as Lowercase<string>) ?? undefined,
  }
}

export type DBSession = {
  id: string
  user_id: string
  expires: Date
  session_token: string
}

export function toAdapterSession(session: DBSession): AdapterSession {
  return {
    userId: session.user_id,
    expires: session.expires,
    sessionToken: session.session_token,
  }
}

export type DBVerificationToken = {
  id: string
  identifier: string
  expires: Date
  token: string
}

export function toAdapterVerificationToken(
  verificationToken: DBVerificationToken
): VerificationToken {
  const { id, ...rest } = verificationToken
  return rest
}
