import { runBasicTests } from "@auth/adapter-test"
import AstraDBAdapter from "../src"
import axios from "axios"
import { JsonApiConfig } from "../src/types"
import { config } from "dotenv"
import {
  ACCOUNTS_COLLECTION,
  SESSIONS_COLLECTION,
  TOKENS_COLLECTION,
  USERS_COLLECTION,
} from "../src/ constants"

// Load environment variables from a .env file if necessary
config()

const jsonApiConfig: JsonApiConfig = {
  ASTRA_DB_ID: process.env.ASTRA_DB_ID || "",
  ASTRA_DB_REGION: process.env.ASTRA_DB_REGION || "",
  ASTRA_DB_KEYSPACE: process.env.ASTRA_DB_KEYSPACE || "",
  ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN || "",
}
const URL = `https://${jsonApiConfig.ASTRA_DB_ID}-${jsonApiConfig.ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/${jsonApiConfig.ASTRA_DB_KEYSPACE}`
const CONFIG = {
  method: "post",
  maxBodyLength: Infinity,
  headers: {
    "x-cassandra-token": process.env.ASTRA_DB_APPLICATION_TOKEN,
    "Content-Type": "application/json",
  },
}

jest.setTimeout(20000)

runBasicTests({
  adapter: AstraDBAdapter(jsonApiConfig),
  db: {
    /**
     * A simple query function that retrieves a session directly from the database using a session token.
     *
     * @param {string} sessionToken - The session token used to identify and retrieve the session.
     * @returns {*} The retrieved session from the database.
     */
    session: async (sessionToken: string) => {
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
    },
    /**
     * A simple query function that retrieves a user directly from the database using a user ID.
     *
     * @param {string} id - The user ID used to identify and retrieve the user.
     * @returns {*} The retrieved user from the database.
     */
    user: async (id: string) => {
      const getData = JSON.stringify({
        findOne: {
          filter: {
            _id: id,
          },
        },
      })

      const getConfig = {
        ...CONFIG,
        url: `${URL}/${USERS_COLLECTION}`,
        data: getData,
      }

      const response = await axios.request(getConfig)
      const data = response?.data?.data?.document
      if (data === "null" || data === null) {
        return null
      }
      const userData = {
        id: data._id,
        name: data.name,
        email: data.email,
        emailVerified: new Date(data.emailVerified),
        image: data.image,
      }
      return userData
    },
    /**
     * A simple query function that retrieves an account directly from the database using provider information.
     *
     * @param {Object} providerAccountId - An object containing the provider and providerAccountId to identify and retrieve the account.
     * @param {string} providerAccountId.provider - The name of the account provider.
     * @param {string} providerAccountId.providerAccountId - The unique identifier for the account with the provider.
     * @returns {*} The retrieved account from the database.
     */
    account: async (providerAccountId: {
      provider: string
      providerAccountId: string
    }) => {
      const getData = JSON.stringify({
        findOne: {
          filter: {
            provider: providerAccountId.provider,
            providerAccountId: providerAccountId.providerAccountId,
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
      const renamedObject = { ...getAccountData, id: getAccountData._id }
      delete renamedObject._id
      return renamedObject
    },
    /**
     * A simple query function that retrieves a verification token directly from the database,
     * based on the user identifier and the hashed verification token.
     *
     * @param {Object} params - An object containing the identifier and token used to identify and retrieve the verification token.
     * @param {string} params.identifier - The user identifier associated with the token.
     * @param {string} params.token - The hashed verification token.
     * @returns {*} The retrieved verification token from the database.
     */
    verificationToken: async (params: {
      identifier: string
      token: string
    }) => {
      const getData = JSON.stringify({
        findOne: {
          filter: {
            identifier: params.identifier,
            token: params.token,
          },
        },
      })

      const getConfig = {
        ...CONFIG,
        url: `${URL}/${TOKENS_COLLECTION}`,
        data: getData,
      }

      const getToken = await axios.request(getConfig)
      const getTokenData = getToken.data.data.document
      if (getTokenData === "null" || getTokenData === null) {
        console.error("failed to get the token for :>> ", params.token)
        return null
      }
      const tokenData = {
        token: getTokenData.token,
        identifier: getTokenData.identifier,
        expires: new Date(getTokenData.expires),
      }
      return tokenData
    },
  },
})
