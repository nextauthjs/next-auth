import type { AppOptions } from "next-auth/internals"
import { createHash } from "crypto"
import PouchDB from "pouchdb"
import memoryAdapter from "pouchdb-adapter-memory"
import find from "pouchdb-find"
import { ulid } from "ulid"
import Providers from "next-auth/providers"
import { PouchDBAdapter } from "../src"
import { runBasicTests } from "@next-auth/adapter-test"

// pouchdb setup
PouchDB.plugin(memoryAdapter).plugin(find)
let pouchdb: PouchDB.Database
let pouchdbIsDestroyed: boolean = false
let pouchdbAdapter: any
let adapter: any
PouchDB.on("created", function () {
  pouchdbIsDestroyed = false
})
PouchDB.on("destroyed", function () {
  pouchdbIsDestroyed = true
})
const disconnect = async () => {
  if (!pouchdbIsDestroyed) await pouchdb.destroy()
}

// Basic tests
pouchdb = new PouchDB(ulid(), { adapter: "memory" })
pouchdbAdapter = PouchDBAdapter(pouchdb)

runBasicTests({
  adapter: pouchdbAdapter,
  db: {
    disconnect,
    async session(sessionToken) {
      const res = await pouchdb.find({
        use_index: "nextAuthSessionByToken",
        selector: {
          "data.sessionToken": { $eq: sessionToken },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      return doc?.data ?? null
    },
    async expireSession(sessionToken, expires) {
      const res = await pouchdb.find({
        use_index: "nextAuthSessionByToken",
        selector: {
          "data.sessionToken": { $eq: sessionToken },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      doc.data.expires = expires.toISOString()
      await pouchdb.put({
        ...doc,
      })
      doc.data.expires = expires
      return doc?.data ?? null
    },
    async user(id) {
      const res: any = await pouchdb.get(id)
      return res.data
    },
    async account(providerId, providerAccountId) {
      const res = await pouchdb.find({
        use_index: "nextAuthAccountByProviderId",
        selector: {
          "data.providerId": { $eq: providerId },
          "data.providerAccountId": { $eq: providerAccountId },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      return doc?.data ?? null
    },
    async verificationRequest(identifier, token) {
      const res = await pouchdb.find({
        use_index: "nextAuthVerificationRequestByToken",
        selector: {
          "data.identifier": { $eq: identifier },
          "data.token": { $eq: token },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      const verificationRequest = doc?.data ?? null
      if (verificationRequest?.expires) {
        return {
          ...verificationRequest,
          expires: new Date(verificationRequest.expires),
        }
      }
      return null
    },
  },
  mock: {
    user: {
      emailVerified: new Date("2017-01-01"),
    },
  },
})

// Custom tests

// Prevent "ReferenceError: You are trying to import a file after the Jest environment has been torn down" https://stackoverflow.com/questions/50793885/referenceerror-you-are-trying-to-import-a-file-after-the-jest-environment-has#50793993
// jest.useFakeTimers()

const sendVerificationRequestMock = jest.fn()

const emailProvider = {
  ...Providers.Email({
    sendVerificationRequest: sendVerificationRequestMock,
  }),
}

const appOptions: AppOptions = {
  action: "signin",
  basePath: "",
  baseUrl: "",
  callbacks: {},
  cookies: {},
  debug: false,
  events: {},
  jwt: {},
  theme: "auto",
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as const,
  pages: {},
  providers: [],
  secret: "",
  session: {
    jwt: false,
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  adapter: pouchdbAdapter,
}

const mock = {
  user: {
    email: "EMAIL",
    name: "NAME",
    image: "IMAGE",
  },
  updatedUser: {
    email: "UPDATED_EMAIL",
    name: "UPDATED_NAME",
    image: "UPDATED_IMAGE",
  },
  account: {
    providerId: "PROVIDER_ID",
    providerType: "PROVIDER_TYPE",
    providerAccountId: "PROVIDER_ACCOUNT_ID",
    refreshToken: "REFRESH_TOKEN",
    accessToken: "ACCESS_TOKEN",
    accessTokenExpires: 0,
  },
  session: {
    sessionToken: "SESSION_TOKEN",
    accessToken: "ACCESS_TOKEN",
    expires: new Date(Date.now() + 10000).toISOString(),
  },
  verificationRequest: {
    identifier: "IDENTIFIER",
    url: "URL",
    token: createHash("sha256").update(`${"TOKEN"}${"SECRET"}`).digest("hex"),
    baseUrl: appOptions.baseUrl,
    provider: emailProvider,
  },
  TOKEN: "TOKEN",
  SECRET: "SECRET",
}
describe("Additional tests", () => {
  beforeEach(async () => {
    try {
      pouchdb = new PouchDB(ulid(), { adapter: "memory" })
      pouchdbAdapter = PouchDBAdapter(pouchdb)
      adapter = await pouchdbAdapter.getAdapter({ ...appOptions })
    } catch (error) {
      console.log(error)
    }
  })

  afterEach(async () => await disconnect())

  test.skip("deleteUser", async () => {
    const id = ["USER", ulid()].join("_")
    await pouchdb.put({ _id: id, data: { id, ...mock.user } })

    await adapter.deleteUser(id)

    const res = await pouchdb.get(id).catch((e) => e.status)
    expect(res).toBe(404)
  })

  test.skip("unlinkAccount", async () => {
    const userId = ["USER", ulid()].join("_")
    const accountId = ["ACCOUNT", ulid()].join("_")
    await pouchdb.put({ _id: userId, data: { id: userId, ...mock.user } })
    await pouchdb.put({
      _id: accountId,
      data: {
        ...mock.account,
        userId,
        accessTokenExpires: new Date(mock.account.accessTokenExpires),
      },
    })

    await adapter.unlinkAccount(
      userId,
      mock.account.providerId,
      mock.account.providerAccountId
    )

    const res: any = await pouchdb.find({
      use_index: "nextAuthAccountByProviderId",
      selector: {
        "data.providerId": { $eq: mock.account.providerId },
        "data.providerAccountId": { $eq: mock.account.providerAccountId },
      },
      limit: 1,
    })
    expect(res.docs).toHaveLength(0)
  })
})
