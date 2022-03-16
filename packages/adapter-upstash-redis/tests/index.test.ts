import upstashRedisClient from "@upstash/redis"
import { runBasicTests } from "adapter-test"
import { reviveFromJson, UpstashRedisAdapter } from "../src"
import "dotenv/config"

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_KEY) {
  console.log(
    "Skipping UpstashRedisAdapter tests, since we are running without required environment variables."
  )

  expect(true).toBe(true)
} else {
  const client = upstashRedisClient(
    process.env.UPSTASH_REDIS_URL,
    process.env.UPSTASH_REDIS_KEY
  )

  runBasicTests({
    adapter: UpstashRedisAdapter(client, { baseKeyPrefix: "testApp:" }),
    db: {
      async user(id: string) {
        const { data } = await client.get(`testApp:user:${id}`)
        return reviveFromJson(data)
      },
      async account({ provider, providerAccountId }) {
        const { data } = await client.get(
          `testApp:user:account:${provider}:${providerAccountId}`
        )
        return reviveFromJson(data)
      },
      async session(sessionToken) {
        const { data } = await client.get(
          `testApp:user:session:${sessionToken}`
        )
        return reviveFromJson(data)
      },
      async verificationToken(where) {
        const { data } = await client.get(
          `testApp:user:token:${where.identifier}`
        )
        return reviveFromJson(data)
      },
    },
  })
}
