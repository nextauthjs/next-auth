import { AdapterUser, AdapterSession, VerificationToken, AdapterAccount } from "@auth/core/adapters"
import { TimeStub } from "fauna"

export type FaunaUser = Omit<AdapterUser, "emailVerified"> & {
  emailVerified: TimeStub
}

export type FaunaSession = Omit<AdapterSession, "expires"> & {
  expires: TimeStub
}

export type FaunaVerificationToken = Omit<VerificationToken, "expires"> & {
  expires: TimeStub
}

export type FaunaAccount = Pick<AdapterAccount, "access_token" | "expires_at" | "id_token" | "provider" | "providerAccountId" | "refresh_token" | "scope" | "token_type" | "type" | "userId"> & {
  session_state?: string
}
