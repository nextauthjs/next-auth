import { runBasicTests } from "../../utils/adapter"
import { hydrateDates, NatsKVAdapter, natsKey } from "../src"
import "dotenv/config"
import { connect } from "@nats-io/transport-node"
import { Kvm, KV } from "@nats-io/kv"

// This functions allows us to open a connection without having to worry about closing it
async function getNextAuthKVandCloseConnection(): Promise<
  { kv: KV } & {
    [Symbol.asyncDispose]: () => Promise<void>
  }
> {
  const nc = await connect({
    servers: "nats://localhost:5222",
    authenticator: undefined,
  })
  const kvm = new Kvm(nc)
  const kv = await kvm.create("authKV")

  return {
    kv: kv,
    [Symbol.asyncDispose]: async () => {
      await nc.drain()
      await nc.close()
    },
  }
}

await runBasicTests({
  adapter: NatsKVAdapter(getNextAuthKVandCloseConnection, {
    baseKeyPrefix: "testApp.",
  }),
  db: {
    disconnect: async () => {
      //do nothing - since the connection itself handles this  (was: await nc.close())
    },
    async account({ provider, providerAccountId }) {
      await using nc = await getNextAuthKVandCloseConnection()
      const data = await nc.kv.get(
        `testApp.user.account.${natsKey(provider)}.${natsKey(providerAccountId)}`
      )
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async user(id: string) {
      await using nc = await getNextAuthKVandCloseConnection()
      const data = await nc.kv.get(`testApp.user.${natsKey(id)}`)
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async session(sessionToken) {
      await using nc = await getNextAuthKVandCloseConnection()
      const data = await nc.kv.get(
        `testApp.user.session.${natsKey(sessionToken)}`
      )
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async verificationToken(where) {
      await using nc = await getNextAuthKVandCloseConnection()
      const data = await nc.kv.get(
        `testApp.user.token.${natsKey(where.identifier)}.${natsKey(where.token)}`
      )
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
  },
})

// Running the same tests again with a static KV natsconnection
const nc = await connect({
  servers: "nats://localhost:5222",
  authenticator: undefined,
})
const kvm = new Kvm(nc)
const kv = await kvm.open("authKV")

await runBasicTests({
  adapter: NatsKVAdapter(kv, {
    baseKeyPrefix: "testApp.",
  }),
  db: {
    disconnect: async () => {
      await nc.drain()
      await nc.close()
    },
    async account({ provider, providerAccountId }) {
      const data = await kv.get(
        `testApp.user.account.${natsKey(provider)}.${natsKey(providerAccountId)}`
      )
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async user(id: string) {
      const data = await kv.get(`testApp.user.${natsKey(id)}`)
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async session(sessionToken) {
      const data = await kv.get(`testApp.user.session.${natsKey(sessionToken)}`)
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
    async verificationToken(where) {
      const data = await kv.get(
        `testApp.user.token.${natsKey(where.identifier)}.${natsKey(where.token)}`
      )
      if (!data || data.length == 0) return null
      return hydrateDates(data.json())
    },
  },
})
