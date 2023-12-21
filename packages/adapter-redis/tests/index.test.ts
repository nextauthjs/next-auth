import { createClient } from "redis"
import { runBasicTests } from "utils/adapter"
import { format, RedisAdapter } from "../src"

globalThis.crypto ??= require("node:crypto").webcrypto

const client = createClient({
  socket: {
    host: "127.0.0.1",
  },
})

runBasicTests({
  // @ts-ignore
  adapter: RedisAdapter(client, { baseKeyPrefix: "testApp:" }),
  db: {
    disconnect: async () => {
      await client.disconnect()
    },
    connect: async () => {
      await client.connect()
    },
    async user(id: string) {
      const data = await client.json.get(`testApp:user:${id}`)
      if (!data) return null
      return format.from(data as Record<string, any>)
    },
    async account({ provider, providerAccountId }) {
      const data = await client.json.get(
        `testApp:user:account:${provider}:${providerAccountId}`
      )
      if (!data) return null
      return format.from(data as Record<string, any>)
    },
    async session(sessionToken) {
      const data = await client.json.get(`testApp:user:session:${sessionToken}`)
      if (!data) return null
      return format.from(data as Record<string, any>)
    },
    async verificationToken(where) {
      const data = await client.json.get(
        `testApp:user:token:${where.identifier}:${where.token}`
      )
      if (!data) return null
      return format.from(data as Record<string, any>)
    },
  },
})
