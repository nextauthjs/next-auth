import { runBasicTests } from "utils/adapter"
import { hydrateDates, NodeRedisAdapter } from "../src"
import { getRedisClient } from "../src/utils"

import "dotenv/config"

const client = await getRedisClient()

runBasicTests({
  adapter: NodeRedisAdapter({ baseKeyPrefix: "testNodeRedis:" }),
  db: {
    disconnect: async () => {
      await client.quit()
    },
    async user(id: string) {
      const data = await client.get(`testNodeRedis:user:${id}`)
      if (!data) return null
      return hydrateDates(JSON.parse(data))
    },
    async account({ provider, providerAccountId }) {
      const data = await client.get(
        `testNodeRedis:user:account:${provider}:${providerAccountId}`
      )
      if (!data) return null
      return hydrateDates(JSON.parse(data))
    },
    async session(sessionToken) {
      const data = await client.get(
        `testNodeRedis:user:session:${sessionToken}`
      )
      if (!data) return null
      return hydrateDates(JSON.parse(data))
    },
    async verificationToken(where) {
      const data = await client.get(
        `testNodeRedis:user:token:${where.identifier}:${where.token}`
      )
      if (!data) return null
      return hydrateDates(JSON.parse(data))
    },
  },
})
