import { AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/src/adapters";
import { runBasicTests } from "utils/adapter";
import { AppwriteAdapter, AppwriteAdapterOptions, formatter } from "../src";
import { Client, Databases, ID, Query } from "node-appwrite";
import { init_db } from "../src/database.ts";

let config: AppwriteAdapterOptions = {
    endpoint: process.env.ENDPOINT as string,
    project_id: process.env.PROJECT_ID as string,
    api_key_secret: process.env.API_KEY_SECRET as string,
    database_id: "",
    user_collection_id: "",
    session_collection_id: "",
    account_collection_id: "",
    verification_token_collection_id: "",
}

const client = new Client();
client
    .setEndpoint(config.endpoint)
    .setProject(config.project_id)
    .setKey(config.api_key_secret)
    .setSelfSigned();


const database = new Databases(client);
runBasicTests({
    adapter: AppwriteAdapter(config),
    db: {
        connect: async () => {
            const updated_config = await init_db(database, config);
            console.log(updated_config);
            config = { ...updated_config }
        },
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