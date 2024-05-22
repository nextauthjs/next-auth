import { AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/src/adapters";
import { runBasicTests } from "utils/adapter";
import { AppwriteAdapter, AppwriteAdapterOptions, formatter } from "../src";
import { Client, Databases, Query } from "node-appwrite";
import { provisionDatabase } from "./provisionDatabase.ts";
import { provisionProject } from "./provisionProject.ts";

const config: AppwriteAdapterOptions = {
    endpoint: process.env.ENDPOINT ?? 'http://localhost/v1' as string,
    project_id: process.env.PROJECT_ID ?? '65eac3fb04f81494cd54' as string,
    api_key_secret: process.env.API_KEY_SECRET ?? '' as string,
    database_id: process.env.DATABASE_ID ?? '65f08e66dcd4c9ea5270'as string,
    user_collection_id: process.env.USER_COLLECTION_ID ?? '65f08e516e74f05f2d74' as string,
    session_collection_id: process.env.SESSION_COLLECTION_ID ?? '65ea775bh75376064dd' as string,
    account_collection_id: process.env.ACCOUNT_COLLECTION_ID ?? '65f08e487033fbe725c0' as string,
    verification_token_collection_id: process.env.VERIFICATION_TOKEN_COLLECTION_ID ?? '65f08b757487d402e4ba' as string,
}

config.api_key_secret = await provisionProject(config);

const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.project_id)
    .setKey(config.api_key_secret)
    .setSelfSigned();

const database = new Databases(client);

await provisionDatabase(database, config);

runBasicTests({
    adapter: AppwriteAdapter(config),
    db: {
        session: async function (sessionToken: string) {
            try {
                const data = await database.listDocuments(
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
                const data = await database.getDocument(
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
                const data = await database.listDocuments(
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
                const data = await database.listDocuments(
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