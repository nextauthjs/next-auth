import { Redis } from "@upstash/redis"
import { runBasicTests } from "adapter-test"
import { hydrateDates, UpstashRedisAdapter } from "../src"
import "dotenv/config"

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_KEY) {
  test("Skipping UpstashRedisAdapter tests, since required environment variables aren't available", () => {
    expect(true).toBe(true)
  })
} else {
  const client = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_KEY,
  })

  runBasicTests({
    adapter: UpstashRedisAdapter(client, { baseKeyPrefix: "testApp:" }),
    db: {
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
          `testApp:user:token:${where.identifier}`
        )
        if (!data) return null
        return hydrateDates(data)
      },
    },
  })
}
