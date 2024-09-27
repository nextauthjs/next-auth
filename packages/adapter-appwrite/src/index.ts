/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Unofficial <a href="https://appwrite.io/">Appwrite</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://appwrite.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/appwrite.png" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/appwrite-adapter node-appwrite
 * ```
 *
 * @module @auth/appwrite-adapter
 */

import { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "@auth/core/src/adapters";
import { Client, Databases, Query, ID } from "node-appwrite";

export interface AppwriteAdapterOptions {
    endpoint: string,
    project_id: string,
    api_key_secret: string,
    database_id?: string,
    user_collection_id?: string,
    session_collection_id?: string,
    account_collection_id?: string,
    verification_token_collection_id?: string;
}

function isDate(date: any) {
    return (
        new Date(date).toString() !== "Invalid Date" && !isNaN(Date.parse(date))
    )
}

export const formatter = {
    user: function <T>(obj: Record<string, any>): T {

        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                delete obj[key]
            }

            if (isDate(value)) {
                obj[key] = new Date(value)
            }
        }

        obj["id"] = obj["$id"];
        delete obj["$id"];
        delete obj["$collectionId"];
        delete obj["$createdAt"];
        delete obj["$databaseId"];
        delete obj["$permissions"];
        delete obj["$updatedAt"];
        delete obj["sessions"];
        delete obj["accounts"];

        return obj as T
    },
    session: function <T>(obj: Record<string, any>): T {

        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                delete obj[key]
            }

            if (isDate(value)) {
                obj[key] = new Date(value)
            }
        }

        obj["id"] = obj["$id"];
        if (obj["userId"]) {
            obj["userId"] = obj["userId"]["$id"]
        }
        delete obj["$id"];
        delete obj["$collectionId"];
        delete obj["$databaseId"];
        delete obj["$updatedAt"];
        delete obj["$createdAt"];
        delete obj["$permissions"];

        return obj as T
    },
    account: function <T>(obj: Record<string, any>): T {

        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                delete obj[key]
            }

            if (isDate(value)) {
                obj[key] = new Date(value)
            }
        }

        obj["id"] = obj["$id"];
        if (obj["userId"]) {
            obj["userId"] = obj["userId"]["$id"]
        }
        delete obj["$id"];
        delete obj["$collectionId"];
        delete obj["$databaseId"];
        delete obj["$updatedAt"];
        delete obj["$createdAt"];
        delete obj["$permissions"];

        return obj as T
    },
    verification_token: function <T>(obj: Record<string, any>): T {

        for (const [key, value] of Object.entries(obj)) {
            if (value === null) {
                delete obj[key]
            }

            if (isDate(value)) {
                obj[key] = new Date(value)
            }
        }

        delete obj["$id"];
        delete obj["$collectionId"];
        delete obj["$databaseId"];
        delete obj["$updatedAt"];
        delete obj["$createdAt"];
        delete obj["$permissions"];

        return obj as T
    }
}

/**
 * :::note
 * This adapter not officially maintained or supported by Appwrite.
 * STEPS: todo
 * ```
 */

export function AppwriteAdapter(config: AppwriteAdapterOptions): Adapter {

    const client = new Client();
    client
        .setEndpoint(config.endpoint)
        .setProject(config.project_id)
        .setKey(config.api_key_secret);

    // Set optional parameters
    config.database_id = config.database_id ?? 'next_auth';
    config.session_collection_id = config.session_collection_id ?? 'sessions';
    config.user_collection_id = config.user_collection_id ?? 'users';
    config.account_collection_id = config.account_collection_id ?? 'accounts';
    config.verification_token_collection_id = config.verification_token_collection_id ?? 'verification_tokens';

    const databases = new Databases(client);

    return {
        async createUser(user) {
            try {
                const data = await databases.createDocument(
                    config.database_id,
                    config.user_collection_id,
                    ID.unique(),
                    { name: user.name, email: user.email, emailVerified: user.emailVerified, image: user.image }
                );
                return formatter.user<AdapterUser>(data)
            } catch (error) {
                throw error
            }
        },
        async getUser(id) {
            try {
                const data = await databases.getDocument(
                    config.database_id,
                    config.user_collection_id,
                    id
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
        async getUserByEmail(email) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.user_collection_id,
                    [
                        Query.equal('email', [email]),
                    ]
                )
                if (data.total === 0) {
                    return null;
                }
                return formatter.user<AdapterUser>(data.documents[0]);
            } catch (error) {
                throw error
            }
        },
        async getUserByAccount({ providerAccountId, provider }) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.account_collection_id,
                    [
                        Query.equal('providerAccountId', [providerAccountId]),
                        Query.equal('provider', [provider]),
                    ]
                )
                if (data.total === 0) {
                    return null;
                }
                return formatter.user<AdapterUser>(data.documents[0]["userId"]);
            } catch (error) {
                throw error
            }
        },
        async updateUser(user) {
            try {
                const data = await databases.updateDocument(
                    config.database_id,
                    config.user_collection_id,
                    user.id,
                    { name: user.name, email: user.email, emailVerified: user.emailVerified, image: user.image }
                )
                return formatter.user<AdapterUser>(data);
            } catch (error) {
                throw error
            }
        },
        async deleteUser(userId: string) {
            try {
                await databases.deleteDocument(
                    config.database_id,
                    config.user_collection_id,
                    userId,
                )
            } catch (error: any) {
                throw error
            }
        },
        async linkAccount(account) {
            try {
                const data = await databases.createDocument(
                    config.database_id,
                    config.account_collection_id,
                    ID.unique(),
                    { ...account }
                );
                return formatter.account<AdapterAccount>(data);
            } catch (error) {
                throw error
            }
        },
        async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }) {
            try {
                const accountsList = await databases.listDocuments(
                    config.database_id,
                    config.account_collection_id,
                    [
                        Query.equal('providerAccountId', [providerAccountId]),
                        Query.equal('provider', [provider]),
                    ]
                );

                await databases.deleteDocument(
                    config.database_id,
                    config.account_collection_id,
                    accountsList.documents[0]["$id"],
                )
            } catch (error) {
                throw error
            }
        },
        async createSession({ sessionToken, userId, expires }) {
            try {
                const data = await databases.createDocument(
                    config.database_id,
                    config.session_collection_id,
                    ID.unique(),
                    { sessionToken: sessionToken, userId: userId, expires: expires }
                );

                return formatter.session<AdapterSession>(data)
            } catch (error) {
                throw error
            }
        },
        async getSessionAndUser(sessionToken) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.session_collection_id,
                    [
                        Query.equal('sessionToken', [sessionToken]),
                    ]
                )
                if (data.total === 0) {
                    return null
                }

                const user = data.documents[0]["userId"];

                return { session: formatter.session<AdapterSession>(data.documents[0]), user: formatter.user<AdapterUser>(user) };
            } catch (error) {
                throw error
            }
        },
        async updateSession(session) {
            try {
                const sessionsList = await databases.listDocuments(
                    config.database_id,
                    config.session_collection_id,
                    [Query.equal("sessionToken", [session.sessionToken])]
                );

                if (sessionsList.total === 0) {
                    return null;
                }

                const data = await databases.updateDocument(
                    config.database_id,
                    config.session_collection_id,
                    sessionsList.documents[0]["$id"],
                    { ...session }
                )

                return formatter.session<AdapterSession>(data)
            } catch (error) {
                throw error
            }
        },
        async deleteSession(sessionToken) {
            try {
                const sessionsList = await databases.listDocuments(
                    config.database_id,
                    config.session_collection_id,
                    [Query.equal("sessionToken", [sessionToken])]
                );

                await databases.deleteDocument(
                    config.database_id,
                    config.session_collection_id,
                    sessionsList.documents[0]["$id"],
                )
            } catch (error) {
                throw error
            }
        },
        async createVerificationToken(token) {
            try {
                const data = await databases.createDocument(
                    config.database_id,
                    config.verification_token_collection_id,
                    ID.unique(),
                    { ...token }
                )

                return formatter.verification_token<VerificationToken>(data)
            } catch (error) {
                throw error
            }
        },
        async useVerificationToken({ identifier, token }) {
            try {
                const data = await databases.listDocuments(
                    config.database_id,
                    config.verification_token_collection_id,
                    [
                        Query.equal("identifier", [identifier]),
                        Query.equal("token", [token]),
                    ]
                );

                if (!data || data.total === 0) {
                    return null
                }
                await databases.deleteDocument(
                    config.database_id,
                    config.verification_token_collection_id,
                    data.documents[0]["$id"]
                );

                return formatter.verification_token<VerificationToken>(data.documents[0])
            } catch (error) {
                throw error
            }
        },

    }
}

