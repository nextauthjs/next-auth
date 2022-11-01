import { GraphQLClient } from "graphql-request";
import type { PatchedRequestInit } from "graphql-request/dist/types";
import type {
    Adapter,
} from "next-auth/adapters";
import { useFragment } from "./gql";
import { AccountFragmentDoc, CreateAccountDocument, CreateSessionDocument, CreateUserDocument, CreateVerificationTokenDocument, DeleteAccountDocument, DeleteSessionDocument, DeleteUserDocument, DeleteVerificationTokenDocument, GetSessionAndUserDocument, GetUserDocument, GetUsersDocument, SessionFragmentDoc, UpdateSessionDocument, UpdateUserDocument, UserFragmentDoc, VerificationTokenFragmentDoc } from "./gql/graphql";

import { nullsToUndefined, transformDate } from "./utils";

interface HasuraAdapterArgs {
    endpoint: string;
    adminSecret: string;
    graphqlRequestOptions?: PatchedRequestInit;
};

export const HasuraAdapter = ({
    endpoint,
    adminSecret,
    graphqlRequestOptions
}: HasuraAdapterArgs): Adapter => {
    const client = new GraphQLClient(endpoint, {
        fetch: fetch ?? undefined,
        ...graphqlRequestOptions,
        headers: graphqlRequestOptions?.headers instanceof Function ? graphqlRequestOptions?.headers : {
            ...graphqlRequestOptions?.headers,
            "x-hasura-admin-secret": adminSecret,
        },
    });

    return {
        // User
        createUser: async (data) => {
            const { insert_users_one } = await client.request(CreateUserDocument, { data });
            const user = useFragment(UserFragmentDoc, insert_users_one);

            if (!user) {
                throw new Error("Error creating user");
            }


            return transformDate(user, "emailVerified");
        },
        getUser: async (id) => {
            const { users_by_pk } = await client.request(GetUserDocument, { id });
            const user = useFragment(UserFragmentDoc, users_by_pk);


            return user ? transformDate(user, "emailVerified") : null;
        },
        getUserByEmail: async (email) => {
            const { users } = await client.request(GetUsersDocument, { where: { email: { _eq: email } } });
            const user = useFragment(UserFragmentDoc, users?.[0]);

            if (!user) return null;

            return user ? transformDate(user, "emailVerified") : null;
        },
        getUserByAccount: async ({ providerAccountId, provider }) => {
            const { users } = await client.request(GetUsersDocument, {
                where: {
                    accounts: {
                        provider: { _eq: provider },
                        providerAccountId: { _eq: providerAccountId },
                    },
                },
            });
            const user = useFragment(UserFragmentDoc, users?.[0]);

            if (!user) return null;

            return user ? transformDate(user, "emailVerified") : null;
        },
        updateUser: async ({ id, ...data }) => {
            const { update_users_by_pk } = await client.request(UpdateUserDocument, { id, data });
            const user = useFragment(UserFragmentDoc, update_users_by_pk);

            if (!user) {
                throw new Error("Error updating user");
            }

            return transformDate(user, "emailVerified");
        },
        deleteUser: async (id) => {
            const { delete_users_by_pk } = await client.request(DeleteUserDocument, { id });
            const user = useFragment(UserFragmentDoc, delete_users_by_pk);

            if (!user) {
                throw new Error("Error deleting user");
            }

            return transformDate(user, "emailVerified");
        },
        // Session
        createSession: async (data) => {
            const { insert_sessions_one } = await client.request(CreateSessionDocument, { data });
            const session = useFragment(SessionFragmentDoc, insert_sessions_one);

            if (!session) {
                throw new Error("Error creating session");
            }

            return transformDate(session, "expires");
        },
        getSessionAndUser: async (sessionToken) => {
            const { sessions } = await client.request(GetSessionAndUserDocument, { sessionToken });
            const session = sessions?.[0];

            if (!session) {
                return null;
            }

            const { user, ...sessionData } = session;

            return {
                session: transformDate(useFragment(SessionFragmentDoc, sessionData), "expires"),
                user: transformDate(useFragment(UserFragmentDoc, user), "emailVerified"),
            }
        },
        updateSession: async ({ sessionToken, ...data }) => {
            const { update_sessions } = await client.request(UpdateSessionDocument, { sessionToken, data });
            const session = update_sessions?.returning?.[0];

            if (!session) {
                return null;
            }

            return transformDate(useFragment(SessionFragmentDoc, session), "expires");
        },
        deleteSession: async (sessionToken) => {
            const { delete_sessions } = await client.request(DeleteSessionDocument, { sessionToken });
            const session = delete_sessions?.returning?.[0];

            if (!session) {
                return null;
            }

            return transformDate(useFragment(SessionFragmentDoc, session), "expires");
        },
        // Account
        linkAccount: async (data) => {
            const { insert_accounts_one } = await client.request(CreateAccountDocument, { data });

            if (!insert_accounts_one) {
                return null;
            }

            // eslint-disable-next-line @typescript-eslint/return-await
            return nullsToUndefined(useFragment(AccountFragmentDoc, insert_accounts_one));
        },
        unlinkAccount: async ({ providerAccountId, provider }) => {
            const { delete_accounts } = await client.request(DeleteAccountDocument, { provider, providerAccountId });
            const account = delete_accounts?.returning[0];

            if (!account) {
                return undefined;
            }

            // eslint-disable-next-line @typescript-eslint/return-await
            return nullsToUndefined(useFragment(AccountFragmentDoc, account));
        },
        // Verification Token
        createVerificationToken: async (data) => {
            const { insert_verification_tokens_one } = await client.request(CreateVerificationTokenDocument, { data });

            if (!insert_verification_tokens_one) {
                return null;
            }

            return transformDate(useFragment(VerificationTokenFragmentDoc, insert_verification_tokens_one),
                "expires"
            );
        },
        useVerificationToken: async ({ identifier, token }) => {
            const { delete_verification_tokens } = await client.request(DeleteVerificationTokenDocument, { identifier, token });
            const verificationToken = delete_verification_tokens?.returning?.[0];

            if (!verificationToken) {
                return null;
            }

            return transformDate(useFragment(VerificationTokenFragmentDoc, verificationToken), "expires");
        },
    };
};
