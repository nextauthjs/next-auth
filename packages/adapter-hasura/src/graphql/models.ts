import type { Account } from "next-auth"
import type {
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

export interface Model<T> {
  name: string
  fields: Array<keyof T>
}

export interface Models {
  User: Model<AdapterUser>
  Account: Model<Account>
  Session: Model<AdapterSession>
  VerificationToken: Model<VerificationToken>
}

export const models: Models = {
  User: {
    name: "User",
    fields: ["email", "id", "image", "name", "emailVerified"],
  },
  Account: {
    name: "Account",
    fields: [
      "id",
      "type",
      "provider",
      "providerAccountId",
      "expires_at",
      "token_type",
      "scope",
      "access_token",
      "refresh_token",
      "id_token",
      "session_state",
    ],
  },
  Session: {
    name: "Session",
    fields: ["expires", "id", "sessionToken"],
  },
  VerificationToken: {
    name: "VerificationToken",
    fields: ["identifier", "token", "expires"],
  },
}
