import "dotenv/config"
import { Redis } from "ioredis"
import { runBasicTests } from "utils/adapter"
import { hydrateDates, RedisAdapter } from "../src"

const client = new Redis({
  host: "localhost",
})

runBasicTests({
  adapter: RedisAdapter(client, { baseKeyPrefix: "testApp:" }),
  db: {
    disconnect: async () => {
      await client.flushdb()
      await client.quit()
    },
    async user(id: string) {
      const data = await client.get(`testApp:user:${id}`)
      if (!data) return null
      const user = JSON.parse(data)
      return hydrateDates(user)
    },
    async account({ provider, providerAccountId }) {
      const data = await client.get(
        `testApp:user:account:${provider}:${providerAccountId}`
      )
      if (!data) return null
      const account = JSON.parse(data)
      return hydrateDates(account)
    },
    async session(sessionToken) {
      const data = await client.get(`testApp:user:session:${sessionToken}`)
      if (!data) return null
      const session = JSON.parse(data)
      return hydrateDates(session)
    },
    async verificationToken(where) {
      const data = await client.get(
        `testApp:user:token:${where.identifier}:${where.token}`
      )
      if (!data) return null
      const token = JSON.parse(data)
      return hydrateDates(token)
    },
  },
})
