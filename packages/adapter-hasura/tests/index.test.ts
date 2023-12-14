import { runBasicTests } from "utils/adapter"
import { HasuraAdapter, format } from "../src"
import { useFragment } from "../src/lib/generated"
import {
  AccountFragmentDoc,
  DeleteAllDocument,
  GetAccountDocument,
  GetSessionDocument,
  GetUserDocument,
  GetVerificationTokenDocument,
  SessionFragmentDoc,
  UserFragmentDoc,
  VerificationTokenFragmentDoc,
} from "../src/lib/generated/graphql"
import { client as hasuraClient } from "../src/lib/client"

const client = hasuraClient({
  endpoint: "http://localhost:8080/v1/graphql",
  adminSecret: "myadminsecretkey",
})

runBasicTests({
  adapter: HasuraAdapter({
    adminSecret: "myadminsecretkey",
    endpoint: "http://localhost:8080/v1/graphql",
  }),
  db: {
    async connect() {
      await client.run(DeleteAllDocument)
    },
    async disconnect() {
      await client.run(DeleteAllDocument)
    },
    async user(id) {
      const { users_by_pk } = await client.run(GetUserDocument, { id })
      const user = useFragment(UserFragmentDoc, users_by_pk)
      return format.from(user)
    },
    async account(params) {
      const { accounts } = await client.run(GetAccountDocument, params)

      return useFragment(AccountFragmentDoc, accounts?.[0]) ?? null
    },
    async session(sessionToken) {
      const { sessions_by_pk } = await client.run(GetSessionDocument, {
        sessionToken,
      })

      return format.from(useFragment(SessionFragmentDoc, sessions_by_pk))
    },
    async verificationToken(params) {
      const { verification_tokens } = await client.run(
        GetVerificationTokenDocument,
        params
      )
      const verificationToken = verification_tokens?.[0]

      return format.from(
        useFragment(VerificationTokenFragmentDoc, verificationToken)
      )
    },
  },
})
