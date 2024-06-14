import {
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import { ProviderType } from "@auth/core/providers"
import { RecordId } from "surrealdb.js"

export type Document<T> = T & Record<string, unknown> & { id: RecordId }
export type UserDoc = Document<AdapterUser>
export type AccountDoc<T = RecordId> = {
  id: RecordId
  userId: T
  refresh_token?: string
  access_token?: string
  type: Extract<ProviderType, "oauth" | "oidc" | "email" | "webauthn">
  provider: string
  providerAccountId: string
  expires_at?: number
}
export type SessionDoc<T = RecordId> = Document<AdapterSession> & { userId: T }
export type VerificationTokenDoc = Document<VerificationToken>
