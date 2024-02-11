import { AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/adapters";
import { runBasicTests } from "utils/adapter";
import { AppwriteAdapter, formatter } from "../src";
import sdk, { ID, Query } from "node-appwrite";

const config = {
    endpoint: "",
    project_id: "",
    api_secret_key: "",
    database_id: "",
    user_collection_id: "",
    session_collection_id: "",
    account_collection_id: "",
    verification_token_collection_id: "",
}

const client = new sdk.Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.project_id)
    .setKey(config.api_secret_key);

const databases = new sdk.Databases(client);

runBasicTests({
    adapter: AppwriteAdapter(config),
    db: {
        session: async function (sessionToken: string) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.session_collection_id,
                    [Query.equal("sessionToken", [sessionToken])]
                )

                if (data.total == 0) {
                    return null
                }

                return formatter.session<AdapterSession>(data.documents[0]);
            } catch (error) {
                throw error
            }
        },
        user: async function (id: string) {
            try {
                const data = await databases.getDocument(
                    config.database_id,
                    config.user_collection_id,
                    id,
                )

                if (!data) {
                    return null;
                }
                return formatter.user<AdapterUser>(data);
            } catch (error: any) {
                if (error?.response.code === 404) {
                    return null
                }
                throw error
            }
        },
        account: async function (providerAccountId: { provider: string; providerAccountId: string; }) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.account_collection_id,
                    [
                        Query.equal('providerAccountId', [providerAccountId.providerAccountId]),
                        Query.equal('provider', [providerAccountId.provider]),
                    ]
                )
                if (data.total === 0) {
                    return null;
                }
                return formatter.account<AdapterAccount>(data.documents[0]);
            } catch (error) {
                throw error
            }
        },
        verificationToken: async function (params: { identifier: string; token: string; }) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.verification_token_collection_id,
                    [
                        Query.equal('identifier', [params.identifier]),
                        Query.equal('token', [params.token]),
                    ]
                )
                if (data.total === 0) {
                    return null;
                }
                return formatter.verification_token<VerificationToken>(data.documents[0]);
            } catch (error) {
                throw error
            }
        },
    }
})