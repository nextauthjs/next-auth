import type { GrafbaseClientOptions } from "../src"

import { GrafbaseAdapter } from "../src"
// import * as GraphQL from "../src/grafbase"
import { runBasicTests } from "@next-auth/adapter-test"

runBasicTests({
  adapter: GrafbaseAdapter({
    url: "http://localhost:4000/graphql",
  }),
  db: {
    user: async (id) => {},
    session: async (sessionToken) => {},
    account: async (provider_providerAccountId) => {},
    verificationToken: async (identifier_token) => {},
  },
})
