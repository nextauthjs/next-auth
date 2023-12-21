import { runBasicTests } from "utils/adapter"
import { createClient } from "redis"
import { RedisAdapter, format } from "../src"

const client = createClient({
  socket: {
    host: "127.0.0.1",
  },
})

runBasicTests({
  // @ts-ignore
  adapter: RedisAdapter(client),
  db: {
    disconnect: async () => {
      await client.disconnect()
    },
    connect: async () => {
      await client.connect()
    },
    session: async (sessionToken) => {
      const key = `session:${sessionToken}`
      const value = await client.get(key)
      if (!value) return null
      return format.from(JSON.parse(value))
    },
    user: async (id) => {
      const key = `user:${id}`
      const value = await client.get(key)
      if (!value) return null
      return format.from(JSON.parse(value))
    },
    account: async (providerAccountId) => {
      const key = `account:${providerAccountId.provider}:${providerAccountId.providerAccountId}`
      const value = await client.get(key)
      if (!value) return null
      return format.from(JSON.parse(value))
    },
    verificationToken: async (params: {
      identifier: string
      token: string
    }) => {
      const key = `verification-token:${params.identifier}:${params.token}`
      const value = await client.get(key)
      if (!value) return null
      return format.from(JSON.parse(value))
    },
  },
})
