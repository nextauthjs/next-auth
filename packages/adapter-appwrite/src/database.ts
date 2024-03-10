import { ID, Databases } from "node-appwrite";
import { AppwriteAdapterOptions } from "./index.js";

export async function init_db(database: Databases, config: AppwriteAdapterOptions) {
    //--------------------------------------------------------------//
    //                       CREATE DATABASE                        //
    //--------------------------------------------------------------//
    const database_id = ID.unique();
    await database.create(database_id, "Auth Database").then(async (db_response) => {
        config.database_id = db_response.$id;
        //--------------------------------------------------------------//
        //                      CREATE COLLECTIONS                      //
        //--------------------------------------------------------------//

        // 1. Session collection
        config.session_collection_id = await database.createCollection(db_response.$id, ID.unique(), "sessions").then((res) => res.$id).catch(error => { throw error });

        // 2. Account collection
        config.account_collection_id = await database.createCollection(db_response.$id, ID.unique(), "accounts").then((res) => res.$id).catch(error => { throw error });

        // 3. User collection
        config.user_collection_id = await database.createCollection(db_response.$id, ID.unique(), "users").then((res) => res.$id).catch(error => { throw error });

        // 4. Verification token collection
        config.verification_token_collection_id = await database.createCollection(db_response.$id, ID.unique(), "verification_tokens").then((res) => res.$id).catch(error => { throw error })
    }).then(() => {
        Promise.all([
            database.createStringAttribute(
                config.database_id,
                config.session_collection_id,
                "sessionToken",
                200,
                true
            ),
            database.createStringAttribute(
                config.database_id,
                config.session_collection_id,
                "sessionToken",
                200,
                true
            ),

            //--------------------------------------------------------------//
            //                      CREATE ATTRIBUTES                       //
            //--------------------------------------------------------------//

            // 1. Session collection attributes
            database.createStringAttribute(
                config.database_id,
                config.session_collection_id,
                "sessionToken",
                200,
                true
            ),
            database.createDatetimeAttribute(
                config.database_id,
                config.session_collection_id,
                "expires",
                true
            ),

            // 2. Account collection attributes
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "type",
                100,
                true
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "provider",
                100,
                true
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "providerAccountId",
                200,
                true
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "refresh_token",
                200,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "access_token",
                200,
                false
            ),
            database.createIntegerAttribute(
                config.database_id,
                config.account_collection_id,
                "expires_at",
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "token_type",
                100,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "scope",
                200,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "id_token",
                100,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "session_state",
                200,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "oauth_token_secret",
                200,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.account_collection_id,
                "oauth_token",
                200,
                false
            ),

            // 3. Verification token collection attributes
            database.createStringAttribute(
                config.database_id,
                config.verification_token_collection_id,
                "identifier",
                200,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.verification_token_collection_id,
                "token",
                200,
                false
            ),
            database.createDatetimeAttribute(
                config.database_id,
                config.verification_token_collection_id,
                "expires",
                true
            ),

            // 4. User collection attributes
            database.createStringAttribute(
                config.database_id,
                config.user_collection_id,
                "name",
                100,
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.user_collection_id,
                "email",
                100,
                false
            ),
            database.createDatetimeAttribute(
                config.database_id,
                config.user_collection_id,
                "emailVerified",
                false
            ),
            database.createStringAttribute(
                config.database_id,
                config.user_collection_id,
                "image",
                200,
                false
            ),




            //--------------------------------------------------------------//
            //                      CREATE INDEXES                          //
            //--------------------------------------------------------------//

            // 1. Session collection indexes
            database.createIndex(
                config.database_id,
                config.session_collection_id,
                "sessions_pkey",
                "key",
                ["$id"],
                ["asc"]
            ),
            database.createIndex(
                config.database_id,
                config.session_collection_id,
                "sessionToken_unique",
                "unique",
                ["$sessionToken"],
                ["asc"]
            ),

            // 2. Account collection indexes
            database.createIndex(
                config.database_id,
                config.account_collection_id,
                "accounts_pkey",
                "key",
                ["$id"],
                ["asc"]
            ),
            database.createIndex(
                config.database_id,
                config.account_collection_id,
                "provider_unique",
                "unique",
                ["provider", "providerAccountId"],
                ["asc", "asc"]
            ),

            // 3. User collection indexes
            database.createIndex(
                config.database_id,
                config.user_collection_id,
                "users_pkey",
                "key",
                ["$id"],
                ["asc"]
            ),
            database.createIndex(
                config.database_id,
                config.user_collection_id,
                "email_unique",
                "unique",
                ["email"],
                ["asc"]
            ),

            // 4. Verification token collection indexes
            database.createIndex(
                config.database_id,
                config.verification_token_collection_id,
                "verification_tokens_pkey",
                "key",
                ["token"],
                ["asc"]
            ),
            database.createIndex(
                config.database_id,
                config.verification_token_collection_id,
                "token_identifier_unique",
                "unique",
                ["token", "identifier"],
                ["asc", "asc"]
            ),
            database.createIndex(
                config.database_id,
                config.verification_token_collection_id,
                "token_unique",
                "unique",
                ["token"],
                ["asc"]
            ),

            //--------------------------------------------------------------//
            //                      CREATE RELATIONS                        //
            //--------------------------------------------------------------//

            // 1. User to Sessions relationship
            database.createRelationshipAttribute(
                config.database_id,
                config.user_collection_id,
                config.session_collection_id,
                "oneToMany",
                true,
                "sessions",
                "userId",
                "cascade"
            ),

            // 2. User to Accounts relationship
            database.createRelationshipAttribute(
                config.database_id,
                config.user_collection_id,
                config.account_collection_id,
                "oneToMany",
                true,
                "accounts",
                "userId",
                "cascade"
            ),
        ])
    }).catch(err => {
        console.log(err)
    })
}