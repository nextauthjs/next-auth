import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique())
    .addColumn("emailVerified", "timestamp")
    .addColumn("image", "text")
    .execute()

  await db.schema
    .createTable("account")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "int8")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addColumn(
      "userId",
      "uuid",
      (col) => col.references("user.id").onDelete("cascade").unique() //NOTE this should work alas this is child table
    )
    .execute()

  await db.schema
    .createTable("session")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("sessionToken", "text", (col) => col.unique().notNull())
    .addColumn("expires", "timestamp", (col) => col.notNull())
    .addColumn(
      "userId",
      "uuid",
      (col) => col.references("user.id").onDelete("cascade").unique() //NOTE this should work alas this is child table
    )
    .execute()

  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "text")
    .addColumn("token", "text", (col) => col.unique())
    .addColumn("expires", "timestamp")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("account").execute()
  await db.schema.dropTable("session").execute()
  await db.schema.dropTable("VerificationToken").execute()
  await db.schema.dropTable("user").execute()
}

