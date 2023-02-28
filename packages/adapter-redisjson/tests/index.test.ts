import { RedisClientType, createClient } from "redis"
import { runBasicTests } from "@next-auth/adapter-test"
import { hydrateDates, RedisJSONAdapter } from "../src"
import "dotenv/config"

let client: RedisClientType;

if (!process.env.REDIS_URL) {
  client = createClient();
} else {
  client = createClient({
    url: process.env.REDIS_URL
  })
}

runBasicTests({
  adapter: RedisJSONAdapter(client, { baseKeyPrefix: "testApp:" }),
  db: {
    async disconnect() {
      await client.disconnect();
    },
    async user(id: string) {
      const data = await client.json.get(`testApp:user:${id}`) as object;
      if (!data) return null
      return hydrateDates(data);
    },
    async account({ provider, providerAccountId }) {
      const data = await client.json.get(
        `testApp:user:account:${provider}:${providerAccountId}`
      )  as object;
      if (!data) return null
      return hydrateDates(data);
    },
    async session(sessionToken) {
      const data = await client.json.get(
        `testApp:user:session:${sessionToken}`
      )  as object;
      if (!data) return null
      return hydrateDates(data);
    },
    async verificationToken(where) {
      const data = await client.json.get(
        `testApp:user:token:${where.identifier}:${where.token}`
      )  as object;
      if (!data) return null
      await client.del(`testApp:user:token:${where.identifier}:${where.token}`);
      return hydrateDates(data);
    },
  },
})
