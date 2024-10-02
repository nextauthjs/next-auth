import { Redis } from "@upstash/redis"
import { runBasicTests } from "utils/adapter"
import { hydrateDates, UpstashRedisAdapter } from "../src"
import "dotenv/config"

const client = new Redis({
  url: "http://localhost:8079",
  token: "uwndz1YIfm9k78mx+mjW8qe7CX33VxRYnscDpZVkt4Y=",
})

runBasicTests({
  adapter: UpstashRedisAdapter(client, { baseKeyPrefix: "testApp:" }),
  db: {
    disconnect: client.flushdb,
    async user(id: string) {
      const data = await client.get<object>(`testApp:user:${id}`)
      if (!data) return null
      return hydrateDates(data)
    },
    async account({ provider, providerAccountId }) {
      const data = await client.get<object>(
        `testApp:user:account:${provider}:${providerAccountId}`
      )
      if (!data) return null
      return hydrateDates(data)
    },
    async session(sessionToken) {
      const data = await client.get<object>(
        `testApp:user:session:${sessionToken}`
      )
      if (!data) return null
      return hydrateDates(data)
    },
    async verificationToken(where) {
      const data = await client.get<object>(
        `testApp:user:token:${where.identifier}:${where.token}`
      )
      if (!data) return null
      return hydrateDates(data)
    },
  },
})
