import { runBasicTests } from "utils/adapter"
import { MemoryAdapter, asBase64, initMemory } from "../src"

const memory = initMemory()

runBasicTests({
  adapter: MemoryAdapter(memory),
  db: {
    async user(id: string) {
      return memory.users.get(id) ?? null
    },
    async account(account) {
      return memory.accounts.get(account.providerAccountId) ?? null
    },
    async session(sessionToken) {
      return memory.sessions.get(sessionToken) ?? null
    },
    async verificationToken(verificationToken) {
      return memory.verificationTokens.get(verificationToken.token) ?? null
    },
  },
})
