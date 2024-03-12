import { Client, Databases } from "node-appwrite"
import { AppwriteAdapterOptions } from "../src"

const config: AppwriteAdapterOptions = {
  endpoint: process.env.ENDPOINT as string,
  project_id: process.env.PROJECT_ID as string,
  api_key_secret: process.env.API_KEY_SECRET as string,
  database_id: process.env.DATABASE_ID as string,
  user_collection_id: process.env.USER_COLLECTION_ID as string,
  session_collection_id: process.env.SESSION_COLLECTION_ID as string,
  account_collection_id: process.env.ACCOUNT_COLLECTION_ID as string,
  verification_token_collection_id: process.env.VERIFICATION_TOKEN_COLLECTION_ID as string,
}

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.project_id)
  .setKey(config.api_key_secret)
  .setSelfSigned();


const database = new Databases(client);
const databaseCollections = [
  { id: config.session_collection_id, name: "sessions" },
  { id: config.account_collection_id, name: "accounts" },
  { id: config.user_collection_id, name: "users" },
  { id: config.verification_token_collection_id, name: "verification_tokens" }
];

const collectionAttributes = [
  {
    collectionId: config.session_collection_id,
    attributes: [
      { name: "sessionToken", type: "string", maxLength: 200, required: true },
      { name: "expires", type: "datetime", required: true }
    ]
  },
  {
    collectionId: config.account_collection_id,
    attributes: [
      { name: "type", type: "string", maxLength: 100, required: true },
      { name: "provider", type: "string", maxLength: 100, required: true },
      { name: "providerAccountId", type: "string", maxLength: 200, required: true },
      { name: "refresh_token", type: "string", maxLength: 200, required: false },
      { name: "access_token", type: "string", maxLength: 200, required: false },
      { name: "expires_at", type: "integer", required: false },
      { name: "token_type", type: "string", maxLength: 100, required: false },
      { name: "scope", type: "string", maxLength: 200, required: false },
      { name: "id_token", type: "string", maxLength: 100, required: false },
      { name: "session_state", type: "string", maxLength: 200, required: false },
      { name: "oauth_token_secret", type: "string", maxLength: 200, required: false },
      { name: "oauth_token", type: "string", maxLength: 200, required: false }
    ]
  },
  {
    collectionId: config.user_collection_id,
    attributes: [
      { name: "name", type: "string", maxLength: 100, required: false },
      { name: "email", type: "string", maxLength: 100, required: false },
      { name: "emailVerified", type: "datetime", required: false },
      { name: "image", type: "string", maxLength: 200, required: false }
    ]
  },
  {
    collectionId: config.verification_token_collection_id,
    attributes: [
      { name: "identifier", type: "string", maxLength: 200, required: false },
      { name: "token", type: "string", maxLength: 200, required: false },
      { name: "expires", type: "datetime", required: true }
    ]
  }
];

const collectionRelations = [
  {
    fromCollection: config.user_collection_id,
    toCollection: config.session_collection_id,
    type: "oneToMany",
    isRequired: true,
    fieldName: "sessions",
    fieldReference: "userId",
    cascade: "cascade"
  },
  {
    fromCollection: config.user_collection_id,
    toCollection: config.account_collection_id,
    type: "oneToMany",
    isRequired: true,
    fieldName: "accounts",
    fieldReference: "userId",
    cascade: "cascade"
  }
];

async function createCollections() {
  for (const collection of databaseCollections) {
    await database.createCollection(config.database_id, collection.id, collection.name);
  }
}

async function createAttributes() {
  for (const collection of collectionAttributes) {
    const attributePromises = collection.attributes.map(attribute =>
      attribute.type === "datetime" ?
        database.createDatetimeAttribute(config.database_id, collection.collectionId, attribute.name, attribute.required)
        :
        attribute.type === "integer" ? database.createIntegerAttribute(config.database_id, collection.collectionId, attribute.name, attribute.required)
          :
          database.createStringAttribute(config.database_id, collection.collectionId, attribute.name, attribute.maxLength ?? 200, attribute.required)

    );
    await Promise.all(attributePromises);
  }
}

async function createRelations() {
  for (const relation of collectionRelations) {
    await database.createRelationshipAttribute(config.database_id, relation.fromCollection, relation.toCollection, relation.type, relation.isRequired, relation.fieldName, relation.fieldReference, relation.cascade);
  }
}

async function init_db() {
  try {
    await database.create(config.database_id, "Auth Database");
    await createCollections()
      .then(async () =>
        await createAttributes()
          .then(async () => {
            // await createIndexes();
            await createRelations();
          }))

    console.log("Database initialization completed successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

init_db();
