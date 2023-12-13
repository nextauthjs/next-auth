/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://www.prisma.io/docs">Prisma</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://www.prisma.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/prisma.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @prisma/client @auth/prisma-adapter
 * npm install prisma --save-dev
 * ```
 *
 * @module @auth/prisma-adapter
 */
import type { PrismaClient, Prisma } from "@prisma/client"
import type { Adapter, AdapterAccount } from "@auth/core/adapters"

/**
 * ## Setup
 *
 * Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object:
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { PrismaAdapter } from "@auth/prisma-adapter"
 * import { PrismaClient } from "@prisma/client"
 *
 * const prisma = new PrismaClient()
 *
 * export default NextAuth({
 *   adapter: PrismaAdapter(prisma),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Create the Prisma schema from scratch
 *
 * You need to use at least Prisma 2.26.0. Create a schema file in `prisma/schema.prisma` similar to this one:
 *
 * > This schema is adapted for use in Prisma and based upon our main [schema](https://authjs.dev/reference/core/adapters#models)
 *
 * ```json title="schema.prisma"
 * datasource db {
 *   provider = "postgresql"
 *   url      = env("DATABASE_URL")
 *   shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // Only needed when using a cloud provider that doesn't support the creation of new databases, like Heroku. Learn more: https://pris.ly/d/migrate-shadow
 * }
 *
 * generator client {
 *   provider        = "prisma-client-js"
 *   previewFeatures = ["referentialActions"] // You won't need this in Prisma 3.X or higher.
 * }
 *
 * model Account {
 *   id                 String  @id @default(cuid())
 *   userId             String
 *   type               String
 *   provider           String
 *   providerAccountId  String
 *   refresh_token      String?  @db.Text
 *   access_token       String?  @db.Text
 *   expires_at         Int?
 *   token_type         String?
 *   scope              String?
 *   id_token           String?  @db.Text
 *   session_state      String?
 *
 *   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 *
 *   @@unique([provider, providerAccountId])
 * }
 *
 * model Session {
 *   id           String   @id @default(cuid())
 *   sessionToken String   @unique
 *   userId       String
 *   expires      DateTime
 *   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 * }
 *
 * model User {
 *   id            String    @id @default(cuid())
 *   name          String?
 *   email         String?   @unique
 *   emailVerified DateTime?
 *   image         String?
 *   accounts      Account[]
 *   sessions      Session[]
 * }
 *
 * model VerificationToken {
 *   identifier String
 *   token      String   @unique
 *   expires    DateTime
 *
 *   @@unique([identifier, token])
 * }
 * ```
 *
 * :::note
 * When using the MySQL connector for Prisma, the [Prisma `String` type](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string) gets mapped to `varchar(191)` which may not be long enough to store fields such as `id_token` in the `Account` model. This can be avoided by explicitly using the `Text` type with `@db.Text`.
 * :::
 *
 *
 * ### Create the Prisma schema with `prisma migrate`
 *
 * This will create an SQL migration file and execute it:
 *
 * ```
 * npx prisma migrate dev
 * ```
 *
 * Note that you will need to specify your database connection string in the environment variable `DATABASE_URL`. You can do this by setting it in a `.env` file at the root of your project.
 *
 * To learn more about [Prisma Migrate](https://www.prisma.io/migrate), check out the [Migrate docs](https://www.prisma.io/docs/concepts/components/prisma-migrate).
 *
 * ### Generating the Prisma Client
 *
 * Once you have saved your schema, use the Prisma CLI to generate the Prisma Client:
 *
 * ```
 * npx prisma generate
 * ```
 *
 * To configure your database to use the new schema (i.e. create tables and columns) use the `prisma migrate` command:
 *
 * ```
 * npx prisma migrate dev
 * ```
 *
 * ### MongoDB support
 *
 * Prisma supports MongoDB, and so does Auth.js. Following the instructions of the [Prisma documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb) on the MongoDB connector, things you have to change are:
 *
 * 1. Make sure that the id fields are mapped correctly
 *
 * ```prisma
 * id  String  @id @default(auto()) @map("_id") @db.ObjectId
 * ```
 *
 * 2. The Native database type attribute to `@db.String` from `@db.Text` and userId to `@db.ObjectId`.
 *
 * ```prisma
 * user_id            String   @db.ObjectId
 * refresh_token      String?  @db.String
 * access_token       String?  @db.String
 * id_token           String?  @db.String
 * ```
 *
 * Everything else should be the same.
 *
 * ### Naming Conventions
 *
 * If mixed snake_case and camelCase column names is an issue for you and/or your underlying database system, we recommend using Prisma's `@map()`([see the documentation here](https://www.prisma.io/docs/concepts/components/prisma-schema/names-in-underlying-database)) feature to change the field names. This won't affect Auth.js, but will allow you to customize the column names to whichever naming convention you wish.
 *
 * For example, moving to `snake_case` and plural table names.
 *
 * ```json title="schema.prisma"
 * model Account {
 *   id                 String  @id @default(cuid())
 *   userId             String  @map("user_id")
 *   type               String
 *   provider           String
 *   providerAccountId  String  @map("provider_account_id")
 *   refresh_token      String? @db.Text
 *   access_token       String? @db.Text
 *   expires_at         Int?
 *   token_type         String?
 *   scope              String?
 *   id_token           String? @db.Text
 *   session_state      String?
 *
 *   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
 *
 *   @@unique([provider, providerAccountId])
 *   @@map("accounts")
 * }
 *
 * model Session {
 *   id           String   @id @default(cuid())
 *   sessionToken String   @unique @map("session_token")
 *   userId       String   @map("user_id")
 *   expires      DateTime
 *   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 *
 *   @@map("sessions")
 * }
 *
 * model User {
 *   id            String    @id @default(cuid())
 *   name          String?
 *   email         String?   @unique
 *   emailVerified DateTime? @map("email_verified")
 *   image         String?
 *   accounts      Account[]
 *   sessions      Session[]
 *
 *   @@map("users")
 * }
 *
 * model VerificationToken {
 *   identifier String
 *   token      String   @unique
 *   expires    DateTime
 *
 *   @@unique([identifier, token])
 *   @@map("verificationtokens")
 * }
 * ```
 *
 **/
export function PrismaAdapter(p: PrismaClient): Adapter {
  return {
    createUser: (data) => p.user.create({ data }),
    getUser: (id) => p.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return account?.user ?? null
    },
    updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),
    deleteUser: (id) => p.user.delete({ where: { id } }),
    linkAccount: (data) =>
      p.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session }
    },
    createSession: (data) => p.session.create({ data }),
    updateSession: (data) =>
      p.session.update({ where: { sessionToken: data.sessionToken }, data }),
    deleteSession: (sessionToken) =>
      p.session.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const verificationToken = await p.verificationToken.create({ data })
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id
      return verificationToken
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        })
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id
        return verificationToken
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
          return null
        throw error
      }
    },
  }
}
