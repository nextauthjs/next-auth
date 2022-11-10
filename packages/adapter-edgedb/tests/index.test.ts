import { runBasicTests } from "@next-auth/adapter-test"
import { EdgeDBAdapter } from "../src"
import { createClient } from "edgedb"
import e from "../dbschema/edgeql-js";

if (process.env.CI) {
  // TODO: Fix this
  test('Skipping EdgeDBAdapter tests in CI because of "Request failed" errors. Should revisit', () => {
    expect(true).toBe(true)
  })
  process.exit(0)
}

const client = createClient();

runBasicTests({
  adapter: EdgeDBAdapter(client),
  db: {
    connect: async () => {
      await Promise.all([
        e.delete(e.User).run(client),
        e.delete(e.Account).run(client),
        e.delete(e.Session).run(client),
        e.delete(e.VerificationToken).run(client),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        e.delete(e.User).run(client),
        e.delete(e.Account).run(client),
        e.delete(e.Session).run(client),
        e.delete(e.VerificationToken).run(client),
      ])
    },
    user: async (id) => {
      const query = e.select(e.User, () => ({
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        image: true,
        filter_single: { id },
      }));

      return await query.run(client);
    },
    account: async ({ providerAccountId }) => {
      const query = e.select(e.Account, () => ({
        provider: true,
        providerAccountId: true,
        type: true,
        access_token: true,
        expires_at: true,
        id_token: true,
        refresh_token: true,
        token_type: true,
        scope: true,
        session_state: true,
        id: true,
        userId: true,
        filter_single: { providerAccountId }
      }));

      return await query.run(client);
    },
    session: async (sessionToken) => {
      const query = e.select(e.Session, () => ({
        userId: true,
        id: true,
        expires: true,
        sessionToken: true,
        filter_single: { sessionToken },
      }));

      return await query.run(client);
    },
    async verificationToken({ token }) {
      const query = e.select(e.VerificationToken, () => ({
        identifier: true,
        expires: true,
        token: true,
        filter_single: { token }
      }))

      return await query.run(client)
    },
  },
})
