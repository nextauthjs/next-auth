/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>An official <a href="https://www.postgresql.org/">PostgreSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.postgresql.org/">
 *   <img style={{display: "block"}} src="/img/adapters/postgresjs.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/postgres-adapter postgres
 * ```
 *
 * @module @auth/postgres-adapter
 */

import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
  AdapterAccount,
} from "@auth/core/adapters"

export function mapExpiresAt(account: any): any {
  const expires_at: number = parseInt(account.expires_at)
  return {
    ...account,
    expires_at,
  }
}

/**
 * ## Setup
 *
 * The SQL schema for the tables used by this adapter is as follows. Learn more about the models at our doc page on [Database Models](https://authjs.dev/getting-started/adapters#models).
 *
 * ```sql title="schema.sql"
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- The `nanoid()` function generates a compact, URL-friendly unique identifier.
-- Based on the given size and alphabet, iat creates a randomized string that's ideal for
-- use-cases requiring small, unpredictable IDs (e.g., URL shorteners, generated file names, etc.).
-- While it comes with a default configuration, the function is designed to be flexible,
-- allowing for customization to meet specific needs.
DROP FUNCTION IF EXISTS nanoid(int, text, float);
CREATE OR REPLACE FUNCTION nanoid(
    size int DEFAULT 5, -- The number of symbols in the NanoId String. Must be greater than 0.
    alphabet text DEFAULT '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', -- The symbols used in the NanoId String. Must contain between 1 and 255 symbols.
    additionalBytesFactor float DEFAULT 1.6 -- The additional bytes factor used for calculating the step size. Must be equal or greater then 1.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
AS
$$
DECLARE
    alphabetArray  text[];
    alphabetLength int := 64;
    mask           int := 63;
    step           int := 34;
BEGIN
    IF size IS NULL OR size < 1 THEN
        RAISE EXCEPTION 'The size must be defined and greater than 0!';
    END IF;

    IF alphabet IS NULL OR length(alphabet) = 0 OR length(alphabet) > 255 THEN
        RAISE EXCEPTION 'The alphabet can''t be undefined, zero or bigger than 255 symbols!';
    END IF;

    IF additionalBytesFactor IS NULL OR additionalBytesFactor < 1 THEN
        RAISE EXCEPTION 'The additional bytes factor can''t be less than 1!';
    END IF;

    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);
    mask := (2 << cast(floor(log(alphabetLength - 1) / log(2)) as int)) - 1;
    step := cast(ceil(additionalBytesFactor * mask * size / alphabetLength) AS int);

    IF step > 1024 THEN
        step := 1024; -- The step size % can''t be bigger then 1024!
    END IF;

    RETURN nanoid_optimized(size, alphabet, mask, step);
END
$$;

-- Generates an optimized random string of a specified size using the given alphabet, mask, and step.
-- This optimized version is designed for higher performance and lower memory overhead.
-- No checks are performed! Use it only if you really know what you are doing.
DROP FUNCTION IF EXISTS nanoid_optimized(int, text, int, int);
CREATE OR REPLACE FUNCTION nanoid_optimized(
    size int, -- The desired length of the generated string.
    alphabet text, -- The set of characters to choose from for generating the string.
    mask int, -- The mask used for mapping random bytes to alphabet indices. Should be `(2^n) - 1` where `n` is a power of 2 less than or equal to the alphabet size.
    step int -- The number of random bytes to generate in each iteration. A larger value may speed up the function but increase memory usage.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
AS
$$
DECLARE
    idBuilder      text := '';
    counter        int  := 0;
    bytes          bytea;
    alphabetIndex  int;
    alphabetArray  text[];
    alphabetLength int  := 64;
BEGIN
    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);

    LOOP
        bytes := gen_random_bytes(step);
        FOR counter IN 0..step - 1
            LOOP
                alphabetIndex := (get_byte(bytes, counter) & mask) + 1;
                IF alphabetIndex <= alphabetLength THEN
                    idBuilder := idBuilder || alphabetArray[alphabetIndex];
                    IF length(idBuilder) = size THEN
                        RETURN idBuilder;
                    END IF;
                END IF;
            END LOOP;
    END LOOP;
END
$$;

CREATE TABLE users
(
  id TEXT NOT NULL DEFAULT nanoid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id TEXT NOT NULL DEFAULT nanoid(),
  "userId" TEXT,
  type VARCHAR(255) NOT NULL,
  provider TEXT,
  "providerAccountId" TEXT,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id TEXT NOT NULL DEFAULT nanoid(),
  "userId" TEXT,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT,

  PRIMARY KEY (id)
);
*
 *
 * ```
 *
 * ```typescript title="auth.ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import PostgresJSAdapter from "@auth/postgres-adapter"
 * import postgres from 'postgres'
 *

* export const sql = postgres(
*  process.env.POSTGRES_URL || 'postgresql://username:password@localhost:5432/database',
*  {
*    ssl: 'allow',
*    max: 20,
*    idle_timeout: 30,
*    connect_timeout: 30,
*    prepare: true, 
*    fetch_types: true, 
*  })
*
* 

 *
 * export default NextAuth({
 *   adapter: PostgresJSAdapter(sql),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 */

export default function PostgresJSAdapter(sql: any): Adapter {
  return {
    createUser: async (data) => {
      const x = await sql`
        INSERT INTO users (id, name, email, "emailVerified", image) 
        VALUES (${data.id}, ${data.name}, ${data.email}, ${data.emailVerified}, ${data.image})
    RETURNING id, name, email, "emailVerified", image`

      return x[0]
    },

    async getUser(id) {
      const x = await sql`select * from users where id = ${id}`
      try {
        return x.length === 0 ? null : x[0]
      } catch (e) {
        return null
      }
    },
    async getUserByEmail(email) {
      const x = await sql`select * from users where email = ${email}`
      return x.length !== 0 ? x[0] : null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const x = await sql`
          select u.* from users u join accounts a on u.id = a."userId"
          where 
          a.provider = ${provider} 
          and 
          a."providerAccountId" = ${providerAccountId}`

      return x.length !== 0 ? x[0] : null
    },
    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const fetchSql = await sql`select * from users where id = ${user.id}`
      const oldUser = fetchSql[0]
      const newUser = {
        ...oldUser,
        ...user,
      }
      const { id, name, email, emailVerified, image } = newUser
      const updateSql = await sql`
        UPDATE users set
        name = ${name}, email = ${email}, "emailVerified" = ${emailVerified}, image = ${image}
        where id = ${id}
 RETURNING name, id, email, "emailVerified", image
      `

      return updateSql[0]
    },
    async deleteUser(userId) {
      await sql`delete from users where id = ${userId}`
      await sql`delete from sessions where "userId" = ${userId}`
      await sql`delete from accounts where "userId" = ${userId}`
    },
    async linkAccount(account: AdapterAccount) {
      const {
        userId,
        provider,
        type,
        providerAccountId,
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
      } = account
      const x = await sql`
      insert into accounts 
      (
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values (${userId},${provider}, ${type}, ${providerAccountId}, ${access_token}, (${Number(
        expires_at
      )}), ${refresh_token}, ${id_token}, ${scope}, ${session_state},${token_type})
  returning
        id,
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `

      return mapExpiresAt(x[0])
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`
    },
    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (result1.length === 0) {
        return null
      }
      let session: AdapterSession = result1[0]

      const result2 =
        await sql`select * from users where id = ${session.userId}`
      if (result2.length === 0) {
        return null
      }
      const user = result2[0]

      return {
        session,
        user,
      }
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`)
      }
      const x =
        await sql`insert into sessions ("userId", expires, "sessionToken")
      values (${userId}, ${expires}, ${sessionToken})
      RETURNING id, "sessionToken", "userId", expires`
      return x[0]
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const x1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (x1.length === 0) {
        return null
      }
      const originalSession = x1[0]
      const newSession = {
        ...originalSession,
        ...session,
      }
      const x = await sql`
        UPDATE sessions set
        expires = ${newSession.expires}
        where "sessionToken" = ${newSession.sessionToken}
        `

      return x[0]
    },
    async deleteSession(sessionToken) {
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`
    },
    async createVerificationToken(
      verificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken
      await sql`
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES (${identifier}, ${expires}, ${token})`
      console.log(verificationToken)
      return verificationToken
    },
    async useVerificationToken(verificationToken): Promise<VerificationToken> {
      const { identifier, token } = verificationToken

      let res = await sql`delete from verification_token
      where identifier = ${identifier} and token = ${token}
RETURNING identifier, expires, token`
      return res.length !== 0 ? res[0] : null
    },
  }
}
