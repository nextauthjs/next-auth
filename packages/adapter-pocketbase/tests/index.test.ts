import { runBasicTests } from "utils/adapter"
import { PocketBaseAdapter } from "../src"
import { format } from "../src"
import type { AdapterAccount, VerificationToken } from "@auth/core/adapters"
import type {
  PocketBaseAccount,
  PocketBaseSession,
  PocketBaseUser,
  PocketBaseVerificationToken,
} from "../src"

import Pocketbase from "pocketbase"
import { randomUUID } from "crypto"

const pb = new Pocketbase("http://127.0.0.1:8090")

export const nextAuthCollections = [
  "verificationTokens",
  "sessions",
  "accounts",
  "users",
]

const initCollections = async () => {
  await pb.admins.authWithPassword("username@test.com", "123456123456")

  const collectionNames = (
    await pb.collections.getFullList(nextAuthCollections.length)
  ).map((collection) => collection.name)

  nextAuthCollections.forEach(async (name) => {
    if (collectionNames.includes(name)) {
      await pb.collections.delete(name)
    }
  })

  // create base collection
  const users = await pb.collections.create({
    name: "users",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: false,
      },
      {
        name: "email",
        type: "email",
        required: false,
      },
      {
        name: "emailVerified",
        type: "date",
        required: false,
      },
      {
        name: "image",
        type: "url",
        required: false,
      },
    ],
  })

  await pb.collections.create({
    name: "verificationTokens",
    type: "base",
    schema: [
      {
        name: "identifier",
        type: "text",
        required: true,
      },
      {
        name: "token",
        type: "text",
        required: true,
      },
      {
        name: "expires",
        type: "date",
        required: true,
      },
    ],
  })

  await pb.collections.create({
    name: "sessions",
    type: "base",
    schema: [
      {
        name: "userId",
        type: "relation",
        required: true,
        options: {
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        name: "sessionToken",
        type: "text",
        required: true,
      },
      {
        name: "expires",
        type: "date",
        required: true,
      },
    ],
  })

  await pb.collections.create({
    name: "accounts",
    type: "base",
    schema: [
      {
        name: "userId",
        type: "relation",
        required: true,
        options: {
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        name: "type",
        type: "text",
        required: true,
      },
      {
        name: "provider",
        type: "text",
        required: true,
      },
      {
        name: "providerAccountId",
        type: "text",
        required: true,
      },
      {
        name: "refresh_token",
        type: "text",
        required: false,
      },
      {
        name: "access_token",
        type: "text",
        required: false,
      },
      {
        name: "expires_at",
        type: "number",
        required: false,
      },
      {
        name: "token_type",
        type: "text",
        required: false,
      },
      {
        name: "scope",
        type: "text",
        required: false,
      },
      {
        name: "id_token",
        type: "text",
        required: false,
      },
      {
        name: "session_state",
        type: "text",
        required: false,
      },
    ],
  })
}

const tearDownCollections = async () => {
  for (const collection of nextAuthCollections) {
    await pb.collections.delete(collection)
  }
}

runBasicTests({
  adapter: PocketBaseAdapter(pb, {
    username: "username@test.com",
    password: "123456123456",
    collections: [],
  }),
  db: {
    // random 15 character string
    id: () => randomUUID().slice(0, 15),
    async connect() {
      await initCollections()
    },
    async session(sessionToken) {
      try {
        const pb_session = await pb
          .collection("sessions")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

        if (pb_session.code) return null

        return format.from(pb_session)
      } catch {
        return null
      }
    },
    async user(id) {
      try {
        const pb_user = await pb.collection("users").getOne<PocketBaseUser>(id)

        return format.from(pb_user, true)
      } catch {
        return null
      }
    },
    async account({ provider, providerAccountId }) {
      try {
        const pb_account = await pb
          .collection("accounts")
          .getFirstListItem<PocketBaseAccount>(
            `provider="${provider}" && providerAccountId="${providerAccountId}"`
          )

        if (pb_account.code) return null

        return format.from<AdapterAccount>(pb_account)
      } catch {
        return null
      }
    },
    async verificationToken({ identifier, token }) {
      try {
        const pb_veriToken = await pb
          .collection("verificationTokens")
          .getFirstListItem<PocketBaseVerificationToken>(
            `identifier="${identifier}" && token="${token}"`
          )

        return format.from<VerificationToken>(pb_veriToken)
      } catch {
        return null
      }
    },
    disconnect: () => tearDownCollections(),
  },
})
