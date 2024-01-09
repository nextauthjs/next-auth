
import { runBasicTests } from "utils/adapter"
import { PocketbaseAdapter } from "../src"
import { format } from "../src"
import type {
  AdapterAccount,
  VerificationToken,
  AdapterUser,
  AdapterSession,
} from "@auth/core/adapters"
import type {
  PocketBaseAccount,
  PocketBaseSession,
  PocketBaseUser,
  PocketBaseVerificationToken,
} from "../src"

import Pocketbase from "pocketbase"
const pb = new Pocketbase("http://127.0.0.1:8090")

const initCollections = async () => {
  await pb.admins.authWithPassword('username@test.com', '123456123456');

  // create base collection
  const users = await pb.collections.create({
      name: 'users',
      type: 'base',
      schema: [
          {
              name: 'name',
              type: 'text',
              required: false,
          },
          {
              name: 'email',
              type: 'email',
              required: false,
          },
          {
              name: 'emailVerified',
              type: 'date',
              required: false,
          },
          {
              name: 'image',
              type: 'url',
              required: false,
          }
      ],
  });

  const verificationTokens = await pb.collections.create({
    name: 'verificationTokens',
    type: 'base',
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
      }
    ],
  });

  const sessions = await pb.collections.create({
    name: 'sessions',
    type: 'base',
    schema: [
      {
        name: 'userId',
        type: 'relation',
        required: true,
        options: {
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        name: 'sessionToken',
        type: 'text',
        required: true,
      },
      {
        name: 'expires',
        type: 'date',
        required: true,
      },
    ],
  });

  const accounts = await pb.collections.create({
    name: 'accounts',
    type: 'base',
    schema: [
      {
        name: 'userId',
        type: 'relation',
        required: true,
        options: {
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
          displayFields: null,
        },
      },
      {
        name: 'type',
        type: 'text',
        required: true,
      },
      {
        name: 'provider',
        type: 'text',
        required: true,
      },
      {
        name: 'providerAccountId',
        type: 'text',
        required: true,
      },
      {
        name: 'refresh_token',
        type: 'text',
        required: false,
      },
      {
        name: 'access_token',
        type: 'text',
        required: false,
      },
      {
        name: 'expires_at',
        type: 'number',
        required: false,
      },
      {
        name: 'token_type',
        type: 'text',
        required: false,
      },
      {
        name: 'scope',
        type: 'text',
        required: false,
      },
      {
        name: 'id_token',
        type: 'text',
        required: false,
      },
      {
        name: 'session_state',
        type: 'text',
        required: false,
      }
    ],
  });

  return [users, verificationTokens, sessions, accounts]
}

initCollections().then(collections => {

runBasicTests({
  adapter: PocketbaseAdapter({
    client: pb,
    collections,
    options: {
    username: "username@test.com",
    password: "123456",
  }
  }),
  db: {
    async session(sessionToken) {
      try {
        const pb_session = await pb
          .collection("sessions")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

        if (pb_session.code) throw new Error("could not find session")

        return format<AdapterSession>(pb_session)
      } catch (_) {
        return null
      }
    },
    async user(id) {
      try {
        const pb_user = await pb
          .collection("users")
          .getOne<PocketBaseUser>(id)
        if (pb_user.code) throw new Error("could not find user")

        return format<AdapterUser>(pb_user)
      } catch (_) {
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

        if (pb_account.code) throw new Error("could not find account")

        // Token and Token Secret are a part of the docs' adapter models schema but not expected to be included with the adapter-test account object
        const { oauth_token, oauth_token_secret, ...adapterAccount } =
          format<AdapterAccount>(pb_account)

        return adapterAccount
      } catch (_) {
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

        if (pb_veriToken.code)
          throw new Error("could not find verificationToken")

        // @ts-expect-error
        const { id, ...verificationToken } =
          format<VerificationToken>(pb_veriToken)

        return verificationToken
      } catch (_) {
        return null
      }
    },
  },
})

})