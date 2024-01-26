import { runBasicTests } from "utils/adapter"
import { EdgeDBAdapter } from "../src"
import { createClient } from "edgedb"

const client = createClient()

runBasicTests({
  adapter: EdgeDBAdapter(client),
  db: {
    connect: async () => {
      await client.query(`
        delete User;
        delete Account;
        delete Session;
        delete VerificationToken;
      `)
    },
    disconnect: async () => {
      await client.query(`
        delete User;
        delete Account;
        delete Session;
        delete VerificationToken;
      `)
    },
    user: async (id) => {
      return await client.querySingle(
        `
      select User {
        id,
        email,
        emailVerified,
        name,
        image
      } filter .id = <uuid>$id
      `,
        { id }
      )
    },
    account: async ({ providerAccountId, provider }) => {
      return await client.querySingle(
        `
      select Account {
        provider,
        providerAccountId,
        type,
        access_token,
        expires_at,
        id_token,
        refresh_token,
        token_type,
        scope,
        session_state,
        id,
        userId
      } 
      filter 
        .providerAccountId = <str>$providerAccountId
      and
        .provider = <str>$provider 
      `,
        { providerAccountId, provider }
      )
    },
    session: async (sessionToken) => {
      return await client.querySingle(
        `
      select Session {
        userId,
        id,
        expires,
        sessionToken,
      }
      filter .sessionToken = <str>$sessionToken
      `,
        { sessionToken }
      )
    },
    async verificationToken({ token, identifier }) {
      return await client.querySingle(
        `
      select VerificationToken {
        identifier,
        expires,
        token,
      }
      filter .token = <str>$token
      and
        .identifier = <str>$identifier
      `,
        { token, identifier }
      )
    },
  },
})
