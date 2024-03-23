import { BaseTable } from "./baseTable"
import { z } from "zod"

export class UserTable extends BaseTable {
  readonly table = "user"
  columns = this.setColumns((t) => ({
    id: t.uuid().primaryKey(),
    name: t.text().nullable(),
    email: t.text(),
    image: t.text().nullable(),
    emailVerified: t.timestamp().nullable(),
  }))
}

export class AccountTable extends BaseTable {
  readonly table = "account"
  columns = this.setColumns((t) => ({
    userId: t.uuid().foreignKey("user", "id", {
      onDelete: "CASCADE",
    }),
    type: t.text().asType({
      type: z.enum(["oauth", "email", "credentials"]),
    }),
    provider: t.text(),
    providerAccountId: t.text(),
    access_token: t.text().nullable(),
    token_type: t.text().nullable(),
    id_token: t.text().nullable(),
    refresh_token: t.text().nullable(),
    scope: t.text(),
    expires_at: t.integer().nullable(),
    session_state: t.text().nullable(),
    ...t.primaryKey(["provider", "providerAccountId"]),
  }))
}

export class SessionTable extends BaseTable {
  readonly table = "session"
  columns = this.setColumns((t) => ({
    sessionToken: t.text().primaryKey(),
    userId: t.uuid().foreignKey("user", "id", {
      onDelete: "CASCADE",
    }),
    expires: t.timestamp(),
  }))
}

export class VerificationTokenTable extends BaseTable {
  readonly table = "verificationToken"
  columns = this.setColumns((t) => ({
    identifier: t.text(),
    token: t.text(),
    expires: t.timestamp(),
    ...t.primaryKey(["identifier", "token"]),
  }))
}
