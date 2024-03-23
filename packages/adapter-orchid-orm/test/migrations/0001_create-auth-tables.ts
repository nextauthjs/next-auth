import { change } from "../db/dbScript"

change(async (db) => {
  await db.createTable("user", (t) => ({
    id: t.uuid().primaryKey(),
    name: t.text().nullable(),
    email: t.text(),
    emailVerified: t.timestamp().nullable(),
    image: t.text().nullable(),
  }))

  await db.createTable("verificationToken", (t) => ({
    identifier: t.text(),
    token: t.text(),
    expires: t.timestamp(),
    ...t.primaryKey(["identifier", "token"]),
  }))
})

change(async (db) => {
  await db.createTable("account", (t) => ({
    userId: t.uuid().foreignKey("user", "id", {
      onDelete: "CASCADE",
    }),
    type: t.text(),
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

  await db.createTable("session", (t) => ({
    sessionToken: t.text().primaryKey(),
    userId: t.uuid().foreignKey("user", "id", {
      onDelete: "CASCADE",
    }),
    expires: t.timestamp(),
  }))
})
