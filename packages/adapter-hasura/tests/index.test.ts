import { runBasicTests } from "@next-auth/adapter-test";
import { GraphQLClient } from "graphql-request";
import { HasuraAdapter } from "../src";
import { useFragment } from "../src/gql";
import { AccountFragmentDoc, DeleteAllDocument, GetAccountDocument, GetSessionDocument, GetUserDocument, GetVerificationTokenDocument, SessionFragmentDoc, UserFragmentDoc, VerificationTokenFragmentDoc } from "../src/gql/graphql";
import { nullsToUndefined, transformDate } from "../src/utils";

const client = new GraphQLClient('http://localhost:8080/v1/graphql', {
    headers: {
        "x-hasura-admin-secret": 'myadminsecretkey',
    },
});

runBasicTests({
    adapter: HasuraAdapter({ adminSecret: 'myadminsecretkey', endpoint: 'http://localhost:8080/v1/graphql' }),
    db: {
        connect: async () => {
            await client.request(DeleteAllDocument);
        },
        disconnect: async () => {
            await client.request(DeleteAllDocument);
        },
        user: async (id) => {
            const { users_by_pk } = await client.request(GetUserDocument, { id });
            const user = useFragment(UserFragmentDoc, users_by_pk);


            return user ? transformDate(user, "emailVerified") : null;
        },
        account: async ({ providerAccountId, provider }) => {
            const { accounts } = await client.request(GetAccountDocument, {
                provider,
                providerAccountId
            });

            const account = nullsToUndefined(useFragment(AccountFragmentDoc, accounts?.[0]));
            return account ?? null;
        },
        session: async (sessionToken) => {
            const { sessions_by_pk } = await client.request(GetSessionDocument, { sessionToken });


            if (!sessions_by_pk) {
                return null;
            }

            return transformDate(useFragment(SessionFragmentDoc, sessions_by_pk), "expires");
        },
        verificationToken: async ({ identifier, token }) => {
            const { verification_tokens } = await client.request(GetVerificationTokenDocument, { identifier, token });
            const verificationToken = verification_tokens?.[0];

            if (!verificationToken) {
                return null;
            }

            return transformDate(useFragment(VerificationTokenFragmentDoc, verificationToken), "expires");
        },
    },
})
