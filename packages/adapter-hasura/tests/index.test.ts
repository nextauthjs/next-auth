import { runBasicTests } from "@auth/adapter-test"
import { GraphQLClient } from "graphql-request"
import { HasuraAdapter } from "../src"
import { useFragment } from "../src/lib"
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
} from "../src/lib/graphql"
import type {
  GetAccountQuery,
  GetAccountQueryVariables,
  GetSessionQuery,
  GetSessionQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  GetVerificationTokenQuery,
  GetVerificationTokenQueryVariables,
} from "../src/lib/graphql"
import { formatDateConversion } from "../src/utils"

const client = new GraphQLClient("http://localhost:8080/v1/graphql", {
  headers: {
    "x-hasura-admin-secret": "myadminsecretkey",
  },
})

runBasicTests({
  adapter: HasuraAdapter({
    adminSecret: "myadminsecretkey",
    endpoint: "http://localhost:8080/v1/graphql",
  }),
  db: {
    connect: async () => {
      await client.request(DeleteAllDocument.toString())
    },
    disconnect: async () => {
      await client.request(DeleteAllDocument.toString())
    },
    user: async (id) => {
      const variables: GetUserQueryVariables = { id }
      const { users_by_pk } = await client.request<GetUserQuery>(
        GetUserDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, users_by_pk)

      return user ? formatDateConversion(user, "emailVerified", "toJS") : null
    },
    account: async ({ providerAccountId, provider }) => {
      const variables: GetAccountQueryVariables = {
        provider,
        providerAccountId,
      }
      const { accounts } = await client.request<GetAccountQuery>(
        GetAccountDocument.toString(),
        variables
      )

      const account = useFragment(AccountFragmentDoc, accounts?.[0])
      return account ?? null
    },
    session: async (sessionToken) => {
      const variables: GetSessionQueryVariables = {
        sessionToken,
      }
      const { sessions_by_pk } = await client.request<GetSessionQuery>(
        GetSessionDocument.toString(),
        variables
      )
      if (!sessions_by_pk) {
        return null
      }

      return formatDateConversion(
        useFragment(SessionFragmentDoc, sessions_by_pk),
        "expires",
        "toJS"
      )
    },
    verificationToken: async ({ identifier, token }) => {
      const variables: GetVerificationTokenQueryVariables = {
        identifier,
        token,
      }
      const { verification_tokens } =
        await client.request<GetVerificationTokenQuery>(
          GetVerificationTokenDocument.toString(),
          variables
        )
      const verificationToken = verification_tokens?.[0]

      if (!verificationToken) {
        return null
      }

      return formatDateConversion(
        useFragment(VerificationTokenFragmentDoc, verificationToken),
        "expires",
        "toJS"
      )
    },
  },
})
