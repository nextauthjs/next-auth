import { DgraphAdapter, format } from "../src"
import { client as dgraphClient } from "../src/lib/client"
import * as fragments from "../src/lib/graphql/fragments"
import { runBasicTests } from "utils/adapter"
import fs from "fs"
import path from "path"

import type { DgraphClientParams } from "../src"

let jwtSecret;
try {
  jwtSecret = fs.readFileSync(path.join(process.cwd(), "/test/hs512.key"), {
    encoding: "utf8",
  });
  console.log("Loaded JWT secret from file", jwtSecret);
} catch (error) {
  console.error("Failed to load JWT secret from file:", error);
  process.exit(1);
}

const params: DgraphClientParams = {
  endpoint: "http://localhost:8080/graphql",
  authToken: "test",
  jwtAlgorithm: "HS512",
  jwtSecret: jwtSecret,
}

/** TODO: Add test to `dgraphClient` */
const c = dgraphClient(params)

runBasicTests({
  adapter: DgraphAdapter(params),
  db: {
    id: () => "0x0a0a00a00",
    async disconnect() {
      await c.run(/* GraphQL */ `
        mutation {
          deleteUser(filter: {}) {
            numUids
          }
          deleteVerificationToken(filter: {}) {
            numUids
          }
          deleteSession(filter: {}) {
            numUids
          }
          deleteAccount(filter: {}) {
            numUids
          }
        }
      `)
    },
    async user(id) {
      const result = await c.run<any>(
        /* GraphQL */ `
          query ($id: ID!) {
            getUser(id: $id) {
              ...UserFragment
            }
          }
          ${fragments.User}
        `,
        { id }
      )

      return format.from(result)
    },
    async session(sessionToken) {
      const result = await c.run<any>(
        /* GraphQL */ `
          query ($sessionToken: String!) {
            querySession(filter: { sessionToken: { eq: $sessionToken } }) {
              ...SessionFragment
              user {
                id
              }
            }
          }
          ${fragments.Session}
        `,
        { sessionToken }
      )

      const { user, ...session } = result?.[0] ?? {}
      if (!user?.id) return null
      return format.from({ ...session, userId: user.id })
    },
    async account(provider_providerAccountId) {
      const result = await c.run<any>(
        /* GraphQL */ `
          query ($providerAccountId: String = "", $provider: String = "") {
            queryAccount(
              filter: {
                providerAccountId: { eq: $providerAccountId }
                provider: { eq: $provider }
              }
            ) {
              ...AccountFragment
              user {
                id
              }
            }
          }
          ${fragments.Account}
        `,
        provider_providerAccountId
      )

      const account = format.from<any>(result?.[0])
      if (!account?.user) return null

      account.userId = account.user.id
      delete account.user
      return account
    },
    async verificationToken(identifier_token) {
      const result = await c.run<any>(
        /* GraphQL */ `
          query ($identifier: String = "", $token: String = "") {
            queryVerificationToken(
              filter: { identifier: { eq: $identifier }, token: { eq: $token } }
            ) {
              ...VerificationTokenFragment
            }
          }
          ${fragments.VerificationToken}
        `,
        identifier_token
      )

      return format.from(result?.[0])
    },
  },
})
