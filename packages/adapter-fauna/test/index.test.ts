import { FaunaAdapter, format } from "../src"
import { runBasicTests } from "utils/adapter"
import { Client, fql, NullDocument } from "fauna"

import type {
  FaunaUser,
  FaunaAccount,
  FaunaSession,
  FaunaVerificationToken,
} from "../src"

const client = new Client({
  secret: "secret",
  endpoint: new URL("http://localhost:8443"),
})

runBasicTests({
  adapter: FaunaAdapter(client),
  db: {
    // UUID is not a valid ID in Fauna (see https://docs.fauna.com/fauna/current/reference/fql_reference/types#id)
    id: () => String(Math.floor(Math.random() * 10 ** 18)),
    user: async (id) => {
      const response = await client.query<FaunaUser>(fql`User.byId(${id})`)
      if (response.data instanceof NullDocument) return null
      return format.from(response.data)
    },
    async session(sessionToken) {
      const response = await client.query<FaunaSession>(
        fql`Session.bySessionToken(${sessionToken}).first()`
      )
      return format.from(response.data)
    },
    async account({ provider, providerAccountId }) {
      const response = await client.query<FaunaAccount>(
        fql`Account.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()`
      )
      return format.from(response.data)
    },
    async verificationToken({ identifier, token }) {
      const response = await client.query<FaunaVerificationToken>(
        fql`VerificationToken.byIdentifierAndToken(${identifier}, ${token}).first()`
      )
      const _verificationToken: Partial<FaunaVerificationToken> = {
        ...response.data,
      }
      delete _verificationToken.id
      return format.from(_verificationToken)
    },
  },
})

runBasicTests({
  adapter: FaunaAdapter(client, {
    collectionNames: {
      user: "CustomUser",
      account: "CustomAccount",
      session: "CustomSession",
      verificationToken: "CustomVerificationToken",
    },
  }),
  db: {
    // UUID is not a valid ID in Fauna (see https://docs.fauna.com/fauna/current/reference/fql_reference/types#id)
    id: () => String(Math.floor(Math.random() * 10 ** 18)),
    user: async (id) => {
      const response = await client.query<FaunaUser>(
        fql`CustomUser.byId(${id})`
      )
      if (response.data instanceof NullDocument) return null
      return format.from(response.data)
    },
    async session(sessionToken) {
      const response = await client.query<FaunaSession>(
        fql`CustomSession.bySessionToken(${sessionToken}).first()`
      )
      return format.from(response.data)
    },
    async account({ provider, providerAccountId }) {
      const response = await client.query<FaunaAccount>(
        fql`CustomAccount.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()`
      )
      return format.from(response.data)
    },
    async verificationToken({ identifier, token }) {
      const response = await client.query<FaunaVerificationToken>(
        fql`CustomVerificationToken.byIdentifierAndToken(${identifier}, ${token}).first()`
      )
      const _verificationToken: Partial<FaunaVerificationToken> = {
        ...response.data,
      }
      delete _verificationToken.id
      return format.from(_verificationToken)
    },
  },
})
