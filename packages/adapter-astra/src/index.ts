/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>An official <a href="https://astra.datastax.com/">Astra DB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://astra.datastax.com/">
 *   <img style={{display: "block"}} src="/img/adapters/astra.png" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @auth/astra-adapter
 * ```
 *
 * @module @auth/astra-adapter
 */

/**
 * ## Setup
 * 
 * Require the mentioned collections in the Cassandra Database:
 * "users"
 * "sessions"
 * "accounts"
 * "tokens"
 * 
 * How to create the required collections:
 * cURL request 
 * 
 * ---------------------------------------------------------------------------------------------------------------------------
    curl --location 'https://{{jsonApiConfig.ASTRA_DB_ID}}-{{jsonApiConfig.ASTRA_DB_REGION}}.apps.astra.datastax.com/api/json/v1/{{jsonApiConfig.ASTRA_DB_KEYSPACE}}' \
    --header 'x-cassandra-token: {{jsonApiConfig.ASTRA_DB_APPLICATION_TOKEN}}' \
    --header 'Content-Type: application/json' \
    --data '{
      "createCollection": {
        "name": "simple_collection"
      }
    }'
  ----------------------------------------------------------------------------------------------------------------------------
 */

/**
 * ### required environment variables:
 * ASTRA_DB_ID
 * ASTRA_DB_REGION
 * ASTRA_DB_KEYSPACE
 * ASTRA_DB_APPLICATION_TOKEN
 */

/**
 * ### JsonApiConfig (config) required for the Adapter | JsonApiConfig.ts
 * ------------------------------------------------------------------------------
  import { JsonApiConfig } from ""@auth/astra-adapter/types"

  export const jsonApiConfig: JsonApiConfig = {
    ASTRA_DB_ID: process.env.ASTRA_DB_ID || '',
    ASTRA_DB_REGION: process.env.ASTRA_DB_REGION || '',
    ASTRA_DB_KEYSPACE: process.env.ASTRA_DB_KEYSPACE || '',
    ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN || ''
  }
   -------------------------------------------------------------------------------
 * 
 */

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  VerificationToken,
  AdapterSession,
} from "@auth/core/adapters"

import axios from "axios"
import { JsonApiConfig } from "./types"
import {
  ACCOUNTS_COLLECTION,
  SESSIONS_COLLECTION,
  TOKENS_COLLECTION,
  USERS_COLLECTION,
} from "./ constants"

export default function AstraDBAdapter(jsonApiConfig: JsonApiConfig): Adapter {
  /**
   * The URL for making API requests to Astra by DataStax.
   * @type {string}
   */
  const URL = `https://${jsonApiConfig.ASTRA_DB_ID}-${jsonApiConfig.ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/${jsonApiConfig.ASTRA_DB_KEYSPACE}`
  /**
   * Configuration options for making API requests to Astra by DataStax.
   * @type {Object}
   */
  const CONFIG = {
    method: "post",
    maxBodyLength: Infinity,
    headers: {
      "x-cassandra-token": jsonApiConfig.ASTRA_DB_APPLICATION_TOKEN,
      "Content-Type": "application/json",
    },
  }
  return {
    /**
     * Creates a new user.
     *
     * @param {Omit<AdapterUser, "id">} user - The user object to create.
     * @returns {Promise<AdapterUser>} A promise that resolves to the newly created user object.
     * @throws {Error} If the user creation fails or encounters an error.
     */
    async createUser(user: Omit<AdapterUser, "id">) {
      try {
        if (!user) {
          throw new Error("user is required")
        }
        const { email } = user

        const findOneAndUpdateData = JSON.stringify({
          findOneAndUpdate: {
            filter: {
              email,
            },
            update: { $set: user },
            options: {
              returnDocument: "after",
              upsert: true,
            },
          },
        })

        const axiosConfig = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: findOneAndUpdateData,
        }

        const getResponse = await axios.request(axiosConfig)
        if (getResponse.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ createUser ~ getResponse.data.errors:",
            getResponse.data.errors
          )
          throw new Error("Failed to create user.")
        }
        const data = getResponse.data.data.document
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          emailVerified: new Date(data.emailVerified),
          image: data.image,
        }
        return userData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ createUser ~ error:", error)
        throw new Error("Failed to create user.")
      }
    },
    /**
     * Retrieves a user by their unique identifier.
     *
     * @param {string} id - The unique identifier of the user to retrieve.
     * @returns {Promise<AdapterUser | null>} A promise that resolves to the user object with the specified ID, or null if the user is not found.
     * @throws {Error} If there is an error while attempting to retrieve the user.
     */
    async getUser(id: string) {
      try {
        if (!id) {
          throw new Error("Id is required")
        }
        const getData = JSON.stringify({
          findOne: {
            filter: {
              _id: id ?? "",
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: getData,
        }

        const getResponse = await axios.request(getConfig)

        if (getResponse.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts:159 ~ getUser ~ getResponse.data.errors:",
            getResponse.data.errors
          )
          throw new Error("Failed to get user.")
        }
        if (!getResponse?.data?.data?.document) {
          return null
        }

        const data = getResponse.data.data.document
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          emailVerified: new Date(data.emailVerified),
          image: data.image,
        }
        return userData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ getUser ~ error:", error)
        throw new Error("Failed to get user.")
      }
    },
    /**
     * Retrieves a user by their email address.
     *
     * @param {string} email - The email address of the user to retrieve.
     * @returns {Promise<AdapterUser | null>} A promise that resolves to the user object with the specified email address, or null if the user is not found.
     * @throws {Error} If there is an error while attempting to retrieve the user by email.
     */
    async getUserByEmail(email: string) {
      try {
        if (!email) {
          throw new Error("Email is required")
        }
        const findOneData = JSON.stringify({
          findOne: {
            filter: {
              email,
            },
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: findOneData,
        }

        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ getUserByEmail ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to get user by email.")
        }
        if (!response?.data?.data?.document) {
          return null
        }

        const data = response.data.data.document
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          emailVerified: new Date(data.emailVerified),
          image: data.image,
        }
        return userData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ getUserByEmail ~ error:", error)
        throw new Error("Failed to get user by email.")
      }
    },
    /**
     * Updates a user's information.
     *
     * @param {Partial<AdapterUser> & Pick<AdapterUser, 'id'>} user - The user object with updated information. It should include the "id" property for identifying the user.
     * @returns {Promise<AdapterUser>} A promise that resolves to the updated user object.
     * @throws {Error} If the user update process fails or encounters an error.
     */
    async updateUser(user: Partial<AdapterUser>) {
      try {
        if (!user) {
          throw new Error("User is required.")
        }
        const { id } = user
        const _id = id
        delete user.id

        const findOneAndUpdateData = JSON.stringify({
          findOneAndUpdate: {
            filter: {
              _id,
            },
            update: { $set: user },
            options: {
              returnDocument: "after",
              upsert: false,
            },
          },
        })
        const axiosConfig = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: findOneAndUpdateData,
        }

        const response = await axios.request(axiosConfig)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ updateUser ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to update user.")
        }
        const data = response.data.data.document
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          emailVerified: new Date(data.emailVerified),
          image: data.image,
        }
        return userData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ updateUser ~ error:", error)
        throw new Error("Failed to update user.")
      }
    },
    /**
     * Creates a session for the user and returns it.
     *
     * @param {Object} session - The session object to create.
     * @param {string} session.sessionToken - The unique session object token.
     * @param {string} session.userId - The user's unique identifier associated with the session.
     * @param {Date} session.expires - The expiration date and time of the session.
     * @returns {Promise<AdapterSession>} A promise that resolves to the created session.
     * @throws {Error} If the session creation process fails or encounters an error.
     */
    async createSession(session) {
      try {
        if (!session.userId) {
          throw new Error(`userId is undefined in createSession`)
        }
        const document = {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        }
        const data = JSON.stringify({
          insertOne: {
            document,
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: data,
        }
        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts:284 ~ createSession ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to create session.")
        }
        const insertedid = response?.data?.status?.insertedIds

        const getData = JSON.stringify({
          findOne: {
            filter: {
              _id: insertedid[0] ?? "",
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: getData,
        }

        const getResponse = await axios.request(getConfig)
        if (getResponse.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ createSession ~ getResponse.data.errors:",
            getResponse.data.errors
          )
          throw new Error("Failed to create session.")
        }
        const getSession = getResponse.data.data.document
        const sessionData = {
          id: getSession._id,
          sessionToken: getSession.sessionToken,
          userId: getSession.userId,
          expires: new Date(getSession.expires),
        }

        return sessionData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ createSession ~ error:", error)
        throw new Error("Failed to create session.")
      }
    },
    /**
     * Retrieves a session and the associated user by session token.
     *
     * @param {string} sessionToken - The session token to look up.
     * @returns {Promise<{ session: AdapterSession; user: AdapterUser } | null>} A promise that resolves to an object containing the session and user if found, or null if not found.
     * @throws {Error} In case of encountering an error.
     */
    async getSessionAndUser(sessionToken) {
      try {
        if (!sessionToken) {
          throw new Error("Session token is required.")
        }
        const getData = JSON.stringify({
          findOne: {
            filter: {
              sessionToken: sessionToken,
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: getData,
        }

        const getResponse = await axios.request(getConfig)
        if (getResponse.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts:341 ~ getSessionAndUser ~ getResponse.data.errors:",
            getResponse.data.errors
          )
          throw new Error("Failed to get session and user.")
        }
        if (!getResponse?.data?.data?.document) {
          return null
        }
        const getSession = getResponse.data.data.document
        const sessionData = {
          id: getSession._id,
          sessionToken: getSession.sessionToken,
          userId: getSession.userId,
          expires: new Date(getSession.expires),
        }

        const findOneData = JSON.stringify({
          findOne: {
            filter: {
              _id: sessionData.userId,
            },
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: findOneData,
        }

        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ getSessionAndUser ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to get session and user.")
        }
        if (!getResponse?.data?.data?.document) {
          return null
        }
        const data = response.data.data.document
        const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          emailVerified: new Date(data.emailVerified),
          image: data.image,
        }
        return {
          session: sessionData,
          user: userData,
        }
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ getSessionAndUser ~ error:", error)
        throw new Error("Failed to get session and user.")
      }
    },
    /**
     * Updates a user session in the system.
     *
     * @param {Object} session - The updated session object.
     * @param {string} session.sessionToken - The unique session token to identify the session.
     * @returns {Promise<AdapterSession | null | undefined>} A promise that, upon success, resolves to the updated session or `null` or `undefined` based on specific outcomes.
     * @throws {Error} In case of encountering an error.
     */
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      try {
        if (!session) {
          throw new Error("Session is required.")
        }
        const { sessionToken } = session

        const findOneAndUpdateData = JSON.stringify({
          findOneAndUpdate: {
            filter: {
              sessionToken: sessionToken,
            },
            update: { $set: session },
            options: {
              returnDocument: "after",
              upsert: false,
            },
          },
        })
        const axiosConfig = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: findOneAndUpdateData,
        }

        const getResponse = await axios.request(axiosConfig)
        if (getResponse.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ updateSession ~ getResponse.data.errors:",
            getResponse.data.errors
          )
          throw new Error("Failed to update session.")
        }
        if (!getResponse?.data?.data?.document) {
          return null
        }
        const getSession = getResponse.data.data.document
        if (getSession === "null" || getSession === null) {
          return null
        }
        const sessionData = {
          id: getSession._id,
          sessionToken: getSession.sessionToken,
          userId: getSession.userId,
          expires: new Date(getSession.expires),
        }

        return sessionData
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ updateSession ~ error:", error)
        throw new Error("Failed to update session.")
      }
    },
    /**
     * Deletes a session from the database.
     *
     * @param {string} sessionToken - The session token to be deleted.
     * @returns {Promise<void | AdapterSession | null | undefined>} A promise that, upon success, resolves with no value (`void`). If the session is not found, it may resolve to the deleted session, `null`, or `undefined`.
     * @throws {Error} In case of encountering an error.
     */
    async deleteSession(sessionToken: string) {
      try {
        if (!sessionToken) {
          console.error(`sessionToken is undefined`)
          return null
        }
        let data = JSON.stringify({
          deleteMany: {
            filter: {
              sessionToken: sessionToken,
            },
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: data,
        }
        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts:457 ~ deleteSession ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to delete session.")
        }
        if (!response?.data?.status?.deletedCount) {
          return null
        }
        const deleteCount = response?.data?.status?.deletedCount

        if (deleteCount === 0 || deleteCount === "0") {
          return null
        }
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ deleteSession ~ error:", error)
        throw new Error("Failed to delete session.")
      }
    },
    /**
     * Creates a verification token in the system.
     *
     * @param {VerificationToken} verificationToken - The verification token object to create.
     * @returns {Promise<VerificationToken | null | undefined>} A promise that resolves to the created verification token or `null` or `undefined` based on specific outcomes.
     * @throws {Error} In case of encountering an error.
     */

    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      try {
        if (!verificationToken) {
          throw new Error("Verification token is required.")
        }
        const { identifier, token, expires } = verificationToken
        const document = {
          identifier: identifier,
          token: token,
          expires: expires,
        }
        const data = JSON.stringify({
          insertOne: {
            document,
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${TOKENS_COLLECTION}`,
          data: data,
        }
        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ createVerificationToken ~ response.data.errors :",
            response.data.errors
          )
          throw new Error("Failed to delete session.")
        }
        const insertedid = response?.data?.status?.insertedIds

        if (!insertedid[0]) {
          throw new Error("Failed to create verification token")
        }

        const getData = JSON.stringify({
          findOne: {
            filter: {
              _id: insertedid[0] ?? "",
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${TOKENS_COLLECTION}`,
          data: getData,
        }

        const getToken = await axios.request(getConfig)
        if (getToken.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ createVerificationToken ~ getToken.data.errors:",
            getToken.data.errors
          )
          throw new Error("Failed to create the verification token.")
        }
        const getTokenData = getToken.data.data.document
        if (getTokenData === "null" || getTokenData === null) {
          throw new Error("Failed to get the created verification token")
        }
        const tokenData = {
          token: getTokenData.token,
          identifier: getTokenData.identifier,
          expires: new Date(getTokenData.expires),
        }

        return tokenData
      } catch (error) {
        console.error(
          "🚀 ~ file: index.ts ~ createVerificationToken ~ error:",
          error
        )
        throw new Error("Failed to create verification token.")
      }
    },
    /**
     * Retrieves and consumes a verification token from the database.
     *
     * @param {Object} params - The parameters to identify and consume the token.
     * @param {string} params.identifier - The unique identifier associated with the token.
     * @param {string} params.token - The token value to consume.
     * @returns {Promise<VerificationToken | null>} A promise that, upon success, resolves to the consumed verification token or `null` if not found or if it cannot be consumed again.
     * @throws {Error} In case of encountering an error.
     */
    async useVerificationToken({
      identifier,
      token,
    }): Promise<VerificationToken | null> {
      try {
        const getData = JSON.stringify({
          findOne: {
            filter: {
              identifier: identifier,
              token: token,
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${TOKENS_COLLECTION}`,
          data: getData,
        }

        const getToken = await axios.request(getConfig)
        if (getToken.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ useVerificationToken ~ getToken.data.errors:",
            getToken.data.errors
          )
          throw new Error("Failed to use verification token.")
        }
        if (!getToken?.data?.data?.document) {
          return null
        }
        const getTokenData = getToken.data.data.document
        if (getTokenData === "null" || getTokenData === null) {
          return null
        }
        const tokenData = {
          token: getTokenData.token,
          identifier: getTokenData.identifier,
          expires: new Date(getTokenData.expires),
        }

        const deleteData = JSON.stringify({
          deleteMany: {
            filter: {
              identifier: identifier,
              token: token,
            },
          },
        })

        const deleteConfig = {
          ...CONFIG,
          url: `${URL}/${TOKENS_COLLECTION}`,
          data: deleteData,
        }

        const deleteToken = await axios.request(deleteConfig)
        if (deleteToken.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ AstraDBAdapter ~ deleteToken.data.errors:",
            deleteToken.data.errors
          )
          throw new Error("Failed to use verification token.")
        }
        const deleteCount = deleteToken?.data?.status?.deletedCount
        if (deleteCount === 0 || deleteCount === "0") {
          return null
        }
        return tokenData
      } catch (error) {
        console.error(
          "🚀 ~ file: index.ts ~ useVerificationToken ~ error:",
          error
        )
        throw new Error("Failed to use verification token.")
      }
    },
    /**
     * Links an external account to a user's profile.
     *
     * @param {AdapterAccount} account - The external account to be linked to the user.
     * @returns {Promise<void | AdapterAccount | null | undefined>} A promise that, upon success, resolves with Account details for the user or no value (`void`). If there's an error or if the account cannot be linked, it may resolve to the linked account, `null`, or `undefined`, depending on the specific outcome.
     * @throws {Error} If there is an error while attempting to link the account.
     */
    async linkAccount(account: AdapterAccount) {
      try {
        if (!account) {
          throw new Error("Account is required.")
        }
        const data = JSON.stringify({
          insertOne: {
            document: account,
          },
        })

        const config = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: data,
        }
        const response = await axios.request(config)
        if (response.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ linkAccount ~ response.data.errors:",
            response.data.errors
          )
          throw new Error("Failed to link account.")
        }
        if (!response?.data?.status?.insertedIdst) {
          return null
        }

        const insertedid = response?.data?.status?.insertedIds

        if (!insertedid[0]) {
          throw new Error("Failed to link account")
        }

        const getData = JSON.stringify({
          findOne: {
            filter: {
              _id: insertedid[0] ?? "",
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: getData,
        }

        const getAccount = await axios.request(getConfig)
        const getAccountData = getAccount?.data?.data?.document
        if (getAccountData === "null" || getAccountData === null) {
          throw new Error("Failed to get the created account")
        }

        const renamedObject = { ...getAccountData, id: getAccountData._id }
        delete renamedObject._id

        return renamedObject // Return the inserted account data
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ linkAccount ~ error:", error)
        throw new Error("Failed to link account.")
      }
    },
    /**
     * Retrieves a user using the provider ID and the ID of a specific account associated with the user.
     *
     * @param {Pick<AdapterAccount, "provider" | "providerAccountId">} providerAccountId - The provider and providerAccountId identifying the specific account.
     * @returns {Promise<AdapterUser | null>} A promise that, upon success, resolves to the user associated with the specified account, or `null` if not found.
     * @throws {Error} In case of encountering an error.
     */
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const getData = JSON.stringify({
          findOne: {
            filter: {
              provider: provider,
              providerAccountId: providerAccountId,
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: getData,
        }

        const getAccount = await axios.request(getConfig)
        if (getAccount.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ getUserByAccount ~ getAccount.data.errors:",
            getAccount.data.errors
          )
          throw new Error("Failed to get user by account.")
        }
        if (!getAccount?.data?.data?.document) {
          return null
        }
        const getAccountData = getAccount?.data?.data?.document
        if (getAccountData === "null" || getAccountData === null) {
          return null
        }
        const userId = getAccountData?.userId
        const getUserData = JSON.stringify({
          findOne: {
            filter: {
              _id: userId ?? "",
            },
          },
        })

        const getUserConfig = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: getUserData,
        }

        const getResponse = await axios.request(getUserConfig)
        if (
          getResponse?.data?.data?.document === "null" ||
          getResponse?.data?.data?.document === null
        ) {
          return null
        }

        const userData = getResponse?.data?.data?.document

        const renamedObject = {
          ...userData,
          id: userData._id,
          emailVerified: new Date(userData.emailVerified),
        }
        delete renamedObject._id
        // delete renamedObject.emailVerified
        return renamedObject
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ getUserByAccount ~ error:", error)
        throw new Error("Failed to get user by account.")
      }
    },
    /**
     * Unlinks an external account from a user's profile.
     *
     * @param {Pick<AdapterAccount, "provider" | "providerAccountId">} partialAccount - The provider and providerAccountId identifying the external account to be unlinked.
     * @returns {Promise<void | AdapterAccount | undefined>} A promise that, upon success, resolves with Account object or no value (`void`). If there's an error or if the account cannot be unlinked, it may resolve to the unlinked account or `undefined`, depending on the specific outcome.
     * @throws {Error} If there is an error while attempting to unlink the account.
     */
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      try {
        const getData = JSON.stringify({
          findOne: {
            filter: {
              provider: provider,
              providerAccountId: providerAccountId,
            },
          },
        })

        const getConfig = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: getData,
        }

        const getAccount = await axios.request(getConfig)
        const getAccountData = getAccount?.data?.data?.document
        if (getAccountData === "null" || getAccountData === null) {
          return null
        }

        const accountObject = {
          ...getAccountData,
          id: getAccountData._id,
        }
        delete accountObject._id

        const deleteData = JSON.stringify({
          deleteMany: {
            filter: {
              provider: provider,
              providerAccountId: providerAccountId,
            },
          },
        })

        const deleteConfig = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: deleteData,
        }

        const deleteAccount = await axios.request(deleteConfig)
        if (deleteAccount.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ unlinkAccount ~ deleteAccount.data.errors:",
            deleteAccount.data.errors
          )
          throw new Error("Failed to unlink account.")
        }
        if (!deleteAccount?.data?.status?.deletedCount) {
          return null
        }
        const deleteCount = deleteAccount?.data?.status?.deletedCount
        if (deleteCount === 0 || deleteCount === "0") {
          return null
        }
        return accountObject
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ unlinkAccount ~ error:", error)
        throw new Error("Failed to unlink account.")
      }
    },
    /**
     * Deletes a user by their unique identifier.
     *
     * @param {string} userId - The unique identifier of the user to be deleted.
     * @returns {Promise<void | AdapterUser | null | undefined>} A promise that resolves with no value or `AdapterUser` upon successful deletion. If the user is not found or if there's an error during deletion, it may resolve to `null`, or `undefined` or error based on the specific outcome.
     * @throws {Error} If there is an error while attempting to delete the user.
     */
    async deleteUser(userId: string): Promise<AdapterUser | null | undefined> {
      try {
        const deleteAccountData = JSON.stringify({
          deleteMany: {
            filter: {
              userId: userId,
            },
          },
        })

        const deleteAccountConfig = {
          ...CONFIG,
          url: `${URL}/${ACCOUNTS_COLLECTION}`,
          data: deleteAccountData,
        }

        const deleteAccount = await axios.request(deleteAccountConfig)
        if (deleteAccount.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ deleteUser ~ deleteAccount.data.errors:",
            deleteAccount.data.errors
          )
          throw new Error("Failed to delete account for user.")
        }
        if (!deleteAccount?.data?.status?.deletedCount) {
          return null
        }
        const deleteAccountCount = deleteAccount?.data?.status?.deletedCount
        if (deleteAccountCount === 0 || deleteAccountCount === "0") {
          return null
        }

        let sessionData = JSON.stringify({
          deleteMany: {
            filter: {
              userId: userId,
            },
          },
        })

        const configSession = {
          ...CONFIG,
          url: `${URL}/${SESSIONS_COLLECTION}`,
          data: sessionData,
        }
        const responseSession = await axios.request(configSession)
        if (responseSession.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ deleteUser ~ responseSession.data.errors:",
            responseSession.data.errors
          )
          throw new Error("Failed to delete session for user.")
        }
        if (!responseSession?.data?.status?.deletedCount) {
          return null
        }
        const deleteSessionCount = responseSession?.data?.status?.deletedCount

        if (deleteSessionCount === 0 || deleteSessionCount === "0") {
          return null
        }

        const deleteUserData = JSON.stringify({
          deleteMany: {
            filter: {
              _id: userId,
            },
          },
        })

        const deleteUserConfig = {
          ...CONFIG,
          url: `${URL}/${USERS_COLLECTION}`,
          data: deleteUserData,
        }

        const deleteUser = await axios.request(deleteUserConfig)
        if (deleteUser.data.errors !== undefined) {
          console.error(
            "🚀 ~ file: index.ts ~ deleteUser ~ deleteUser.data.errors:",
            deleteUser.data.errors
          )
          throw new Error("Failed to delete user.")
        }
        if (!deleteUser?.data?.status?.deletedCount) {
          return null
        }
        const deleteUserCount = deleteUser?.data?.status?.deletedCount
        if (deleteUserCount === 0 || deleteUserCount === "0") {
          return null
        }
      } catch (error) {
        console.error("🚀 ~ file: index.ts ~ deleteUser ~ error:", error)
        throw new Error("Failed to delete user.")
      }
    },
  }
}
