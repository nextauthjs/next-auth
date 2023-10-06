import { runBasicTests } from "@auth/adapter-test"
import MemoryAdapter, { asBase64, initMemory } from "../src"

const memory = initMemory()

runBasicTests({
  adapter: MemoryAdapter(memory),
  testAuthenticatorMethods: true,
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
    async authenticators(credentialID) {
      return memory.authenticators.get(asBase64(credentialID)) ?? null
    },
  },
})
