import type { Client } from "@libsql/client"

export const SQL_UP = `
CREATE TABLE IF NOT EXISTS "account" (
	"userId" TEXT NOT NULL,
	"type" TEXT NOT NULL,
	"provider" TEXT NOT NULL,
	"providerAccountId" TEXT NOT NULL,
	"refresh_token" TEXT,
	"access_token" TEXT,
	"expires_at" INTEGER,
	"token_type" TEXT,
	"scope" TEXT,
	"id_token" TEXT,
	"session_state" TEXT,
	PRIMARY KEY("provider", "providerAccountId"),
	FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" TEXT PRIMARY KEY NOT NULL,
	"userId" TEXT NOT NULL,
	"expires" DATETIME NOT NULL,
	FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "user" (
	"id" TEXT PRIMARY KEY NOT NULL,
	"name" TEXT,
	"email" TEXT NOT NULL,
	"emailVerified" DATETIME,
	"image" text
);

CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" TEXT NOT NULL,
	"token" TEXT NOT NULL,
	"expires" DATETIME NOT NULL,
	PRIMARY KEY("identifier", "token")
);
`

export const SQL_DOWN = `
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "verificationToken";
`

export async function up(client: Client) {
  return await client.executeMultiple(SQL_UP)
}

export async function down(client: Client) {
  return await client.executeMultiple(SQL_DOWN)
}
