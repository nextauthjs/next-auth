/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://www.edgedb.com/">Edge DB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.edgedb.com/">
 *   <img style={{display: "block"}} src="/img/adapters/edgedb.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install edgedb @auth/edgedb-adapter
 * npm install @edgedb/generate --save-dev
 * ```
 *
 * @module @auth/edgedb-adapter
 */

import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import type { Client } from "edgedb"

/**
 *
 * To use this Adapter, you need to install `edgedb`, `@edgedb/generate`, and the separate `@auth/edgedb-adapter` package:
 *
 * ```bash npm2yarn
 * npm install edgedb @auth/edgedb-adapter
 * npm install @edgedb/generate --save-dev
 * ```
 *
 * ## Installation
 *
 * First, ensure you have the EdgeDB CLI installed.
 *
 * Follow the instructions below, or read the [EdgeDB quickstart](https://www.edgedb.com/docs/intro/quickstart) to install the EdgeDB CLI and initialize a project
 *
 * ### Linux or macOS
 * ```bash
 * curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
 * ```
 *
 * ### Windows
 * ```powershell
 * iwr https://ps1.edgedb.com -useb | iex
 * ```
 *
 * Check that the CLI is available with the `edgedb --version` command. If you get a `Command not found` error, you may need to open a new terminal window before the `edgedb` command is available.
 *
 * Once the CLI is installed, initialize a project from the application’s root directory. You’ll be presented with a series of prompts.
 *
 * ```bash
 * edgedb project init
 * ```
 *
 * This process will spin up an EdgeDB instance and [“link”](https://www.edgedb.com/docs/cli/edgedb_instance/edgedb_instance_link#edgedb-instance-link) it with your current directory. As long as you’re inside that directory, CLI commands and client libraries will be able to connect to the linked instance automatically, without additional configuration.
 *
 * ## Setup
 *
 * ### NextAuth.js configuration
 *
 * Configure your NextAuth.js to use the EdgeDB Adapter:
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { EdgeDBAdapter } from "@auth/edgedb-adapter"
 * import { createClient } from "edgedb"
 *
 * const client = createClient()
 *
 * export default NextAuth({
 *   adapter: EdgeDBAdapter(client),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Create the EdgeDB schema
 *
 * Replace the contents of the auto-generated file in `dbschema/default.esdl` with the following:
 *
 * > This schema is adapted for use in EdgeDB and based upon our main [schema](https://authjs.dev/getting-started/adapters#models)
 *
 * ```json title="default.esdl"
 * module default {
 *     type User {
 *         property name -> str;
 *         required property email -> str {
 *             constraint exclusive;
 *         }
 *         property emailVerified -> datetime;
 *         property image -> str;
 *         multi link accounts := .<user[is Account];
 *         multi link sessions := .<user[is Session];
 *         property createdAt -> datetime {
 *             default := datetime_current();
 *         };
 *     }
 *
 *     type Account {
 *        required property userId := .user.id;
 *        required property type -> str;
 *        required property provider -> str;
 *        required property providerAccountId -> str {
 *         constraint exclusive;
 *        };
 *        property refresh_token -> str;
 *        property access_token -> str;
 *        property expires_at -> int64;
 *        property token_type -> str;
 *        property scope -> str;
 *        property id_token -> str;
 *        property session_state -> str;
 *        required link user -> User {
 *             on target delete delete source;
 *        };
 *        property createdAt -> datetime {
 *             default := datetime_current();
 *         };
 *
 *        constraint exclusive on ((.provider, .providerAccountId))
 *     }
 *
 *     type Session {
 *         required property sessionToken -> str {
 *             constraint exclusive;
 *         }
 *         required property userId := .user.id;
 *         required property expires -> datetime;
 *         required link user -> User {
 *             on target delete delete source;
 *         };
 *         property createdAt -> datetime {
 *             default := datetime_current();
 *         };
 *     }
 *
 *     type VerificationToken {
 *         required property identifier -> str;
 *         required property token -> str {
 *             constraint exclusive;
 *         }
 *         required property expires -> datetime;
 *         property createdAt -> datetime {
 *             default := datetime_current();
 *         };
 *
 *         constraint exclusive on ((.identifier, .token))
 *     }
 * }
 *
 * # Disable the application of access policies within access policies
 * # themselves. This behavior will become the default in EdgeDB 3.0.
 * # See: https://www.edgedb.com/docs/reference/ddl/access_policies#nonrecursive
 * using future nonrecursive_access_policies;
 * ```
 *
 * ### Migrate the database schema
 *
 * Create a migration
 *
 * ```
 * edgedb migration create
 * ```
 *
 * Apply the migration
 *
 * ```
 * edgedb migrate
 * ```
 *
 * To learn more about [EdgeDB migrations](https://www.edgedb.com/docs/intro/migrations#generate-a-migration), check out the [Migrations docs](https://www.edgedb.com/docs/intro/migrations).
 *
 * ### Generate the query builder
 *
 * ```npm2yarn
 * npx @edgedb/generate edgeql-js
 * ```
 *
 * This will generate the [query builder](https://www.edgedb.com/docs/clients/js/querybuilder) so that you can write fully typed EdgeQL queries with TypeScript in a code-first way.
 *
 * For example
 *
 * ```ts
 * const query = e.select(e.User, () => ({
 *         id: true,
 *         email: true,
 *         emailVerified: true,
 *         name: true,
 *         image: true,
 *         filter_single: { email: 'johndoe@example.com' },
 *       }));
 *
 * return await query.run(client);
 *
 * // Return type:
 * // {
 * //     id: string;
 * //     email: string;
 * //     emailVerified: Date | null;
 * //     image: string | null;
 * //     name: string | null;
 * // } | null
 *
 * ```
 *
 *
 * ## Deploying
 *
 * ### Deploy EdgeDB
 *
 * First deploy an EdgeDB instance on your preferred cloud provider:
 *
 * [AWS](https://www.edgedb.com/docs/guides/deployment/aws_aurora_ecs)
 *
 * [Google Cloud](https://www.edgedb.com/docs/guides/deployment/gcp)
 *
 * [Azure](https://www.edgedb.com/docs/guides/deployment/azure_flexibleserver)
 *
 * [DigitalOcean](https://www.edgedb.com/docs/guides/deployment/digitalocean)
 *
 * [Fly.io](https://www.edgedb.com/docs/guides/deployment/fly_io)
 *
 * [Docker](https://www.edgedb.com/docs/guides/deployment/docker) (cloud-agnostic)
 *
 * ### Find your instance’s DSN
 *
 * The DSN is also known as a connection string. It will have the format `edgedb://username:password@hostname:port`. The exact instructions for this depend on which cloud you are deploying to.
 *
 * ### Set an environment variable
 *
 * ```env title=".env"
 * EDGEDB_DSN=edgedb://johndoe:supersecure@myhost.com:420
 * ```
 *
 * ### Update the client
 *
 * ```diff title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { EdgeDBAdapter } from "@auth/edgedb-adapter"
 * import { createClient } from "edgedb"
 *
 * - const client = createClient()
 * + const client = createClient({ dsn: process.env.EDGEDB_DSN })
 *
 * export default NextAuth({
 *   adapter: EdgeDBAdapter(client),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 *
 *
 * ### Apply migrations
 *
 * Use the DSN to apply migrations against your remote instance.
 *
 * ```bash
 * edgedb migrate --dsn <your-instance-dsn>
 * ```
 *
 * ### Set up a `prebuild` script
 *
 * Add the following `prebuild` script to your `package.json`. When your hosting provider initializes the build, it will trigger this script which will generate the query builder. The `npx @edgedb/generate edgeql-js` command will read the value of the `EDGEDB_DSN` environment variable, connect to the database, and generate the query builder before your hosting provider starts building the project.
 *
 * ```diff title="package.json"
 * "scripts": {
 *   "dev": "next dev",
 *   "build": "next build",
 *   "start": "next start",
 *   "lint": "next lint",
 * +  "prebuild": "npx @edgedb/generate edgeql-js"
 * },
 * ```
 *
 */
export function EdgeDBAdapter(client: Client): Adapter {
  return {
    async createUser({ email, emailVerified, name, image }) {
      return await client.queryRequiredSingle(
        `
        with
          image := <optional str>$image,
          name := <optional str>$name,
          emailVerified := <optional str>$emailVerified

        select (
          insert User {
            email:= <str>$email,
            emailVerified:= <datetime>emailVerified,
            name:= name,
            image:= image,
          }
        ) {
            id,
            email,
            emailVerified,
            name,
            image
          }
        `,
        {
          email,
          emailVerified: emailVerified && new Date(emailVerified).toISOString(),
          name,
          image,
        }
      )
    },
    async getUser(id) {
      return await client.querySingle<AdapterUser>(
        `
        select User {
          id,
          email,
          emailVerified,
          name,
          image
        } filter .id = <uuid>$id;
        `,
        { id }
      )
    },
    async getUserByEmail(email) {
      return await client.querySingle<AdapterUser>(
        `
        select User {
          id,
          email,
          emailVerified,
          name,
          image
        } filter .email = <str>$email;
        `,
        { email }
      )
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return await client.querySingle<AdapterUser>(
        `
        with account := (
          select Account
          filter .providerAccountId = <str>$providerAccountId
             and .provider = <str>$provider
        )
        select account.user {
          id,
          email,
          image,
          name,
          emailVerified
        }
        `,
        { providerAccountId, provider }
      )
    },
    async updateUser({ email, emailVerified, id, image, name }) {
      return await client.queryRequiredSingle<AdapterUser>(
        `       
        with 
          email := <optional str>$email,
          emailVerified := <optional str>$emailVerified, 
          image := <optional str>$image,
          name := <optional str>$name
        
        select (
          update User
          filter .id = <uuid>$id
          set {
            email := email ?? .email,
            emailVerified := <datetime>emailVerified ?? .emailVerified,
            image := image ?? .image,
            name := name ?? .name,
          }
        ) {
          id,
          email,
          emailVerified,
          image,
          name
        }
        `,
        {
          email,
          emailVerified: emailVerified && new Date(emailVerified).toISOString(),
          id,
          image,
          name,
        }
      )
    },
    async deleteUser(id) {
      await client.execute(`delete User filter .id = <uuid>$id;`, { id })
    },
    async linkAccount({
      userId,
      type,
      provider,
      providerAccountId,
      refresh_token,
      access_token,
      expires_at,
      token_type,
      scope,
      id_token,
      session_state,
    }) {
      await client.execute(
        `
        with 
          userId := <optional str>$userId,
          refresh_token := <optional str>$refresh_token,
          access_token := <optional str>$access_token,
          expires_at := <optional str>$expires_at,
          token_type := <optional str>$token_type,
          scope := <optional str>$scope,
          id_token := <optional str>$id_token,
          session_state := <optional str>$session_state

        insert Account {
          type := <str>$type,
          provider := <str>$provider,
          providerAccountId := <str>$providerAccountId,
          refresh_token := refresh_token,
          access_token := access_token,
          expires_at := <int64>expires_at,
          token_type := token_type,
          scope := scope,
          id_token := id_token,
          session_state := session_state,
          user := (
            select User filter .id = <uuid>userId
          )
        }
        `,
        {
          userId,
          type,
          provider,
          providerAccountId,
          refresh_token,
          access_token,
          expires_at: expires_at && String(expires_at),
          token_type,
          scope,
          id_token,
          session_state,
        }
      )
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client.execute(
        `
        delete Account filter 
        .providerAccountId = <str>$providerAccountId
        and
        .provider = <str>$provider
        `,
        { providerAccountId, provider }
      )
    },
    async createSession({ expires, sessionToken, userId }) {
      return await client.queryRequiredSingle<AdapterSession>(
        `   
        select (
          insert Session {
            expires := <datetime>$expires,
            sessionToken := <str>$sessionToken,
            user := (
              select User filter .id = <uuid>$userId
            )
          }
        ) {
          expires,
          sessionToken,
          userId
        };
      `,
        { expires, sessionToken, userId }
      )
    },
    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await client.querySingle<
        AdapterSession & { user: AdapterUser }
      >(
        `
        select Session {
          userId,
          id,
          expires,
          sessionToken,
          user: {
            id,
            email,
            emailVerified,
            image,
            name
          }
        } filter .sessionToken = <str>$sessionToken;
      `,
        { sessionToken }
      )

      if (!sessionAndUser) {
        return null
      }

      const { user, ...session } = sessionAndUser

      if (!user || !session) {
        return null
      }

      return {
        user,
        session,
      }
    },
    async updateSession({ sessionToken, expires, userId }) {
      return await client.querySingle<AdapterSession>(
        `
        with 
          sessionToken := <optional str>$sessionToken,
          expires := <optional str>$expires, 
          userId := <optional str>$userId,
          user := (
            select User filter .id = <uuid>userId
          )

        select (          
          update Session
          filter .sessionToken = <str>$sessionToken
          set {
            sessionToken := sessionToken ?? .sessionToken,
            expires := <datetime>expires ?? .expires,
            user := user ?? .user
          }
        ) {
          sessionToken,
          userId,
          expires
        }
      `,
        {
          sessionToken,
          expires: expires && new Date(expires).toISOString(),
          userId,
        }
      )
    },
    async deleteSession(sessionToken) {
      await client.query(
        `delete Session filter .sessionToken = <str>$sessionToken`,
        { sessionToken }
      )
    },
    async createVerificationToken({ identifier, expires, token }) {
      const createdVerificationToken =
        await client.querySingle<VerificationToken>(
          `
        select (
          insert VerificationToken {
            identifier := <str>$identifier,
            expires := <datetime>$expires,
            token := <str>$token,
          }
        ) {
          identifier,
          expires,
          token
        }
        `,
          { identifier, expires, token }
        )

      return createdVerificationToken
    },
    async useVerificationToken({ token, identifier }) {
      const verificationToken = await client.querySingle<VerificationToken>(
        `
        select (
          delete VerificationToken filter .token = <str>$token
          and
          .identifier = <str>$identifier
        ) {
          identifier,
          expires,
          token
        }
        `,
        { token, identifier }
      )

      if (verificationToken && "id" in verificationToken) {
        delete verificationToken.id
      }
      return verificationToken
    },
  }
}
