import * as admin from "firebase-admin"
import { Account } from "next-auth"
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import { getConverter } from "./converter"

type IndexableObject = Record<string, unknown>

const userConverter = getConverter<AdapterUser>()
const sessionConverter = getConverter<AdapterSession & IndexableObject>()
const accountConverter = getConverter<Account>()
const verificationTokenConverter = getConverter<
  VerificationToken & IndexableObject
>({
  excludeId: true,
})

export function FirestoreAdapterAdmin(): Adapter {
  const db = admin.firestore()

  const Users = db.collection("users").withConverter(userConverter)
  const Sessions = db.collection("sessions").withConverter(sessionConverter)
  const Accounts = db.collection("accounts").withConverter(accountConverter)
  const VerificationTokens = db
    .collection("verificationTokens")
    .withConverter(verificationTokenConverter)

  return {
    async createUser(newUser: Omit<AdapterUser, "id">) {
      //todo: check if `as any` is OK hereP
      const userRef = await Users.add(newUser as any)
      const userSnapshot = await userRef.withConverter(userConverter).get()

      if (userSnapshot.exists && userConverter) {
        return userSnapshot.data()
      }

      throw new Error("[createUser] Failed to create user")
    },
    async getUser(id) {
      const userSnapshot = await Users.doc(id).get()

      if (userSnapshot.exists && userConverter) {
        return userSnapshot.data()
      }

      return null
    },
    async getUserByEmail(email) {
      const userQuery = Users.where("email", "==", email).limit(1)

      const userQuerySnapshot = await userQuery.get()
      const userSnapshot = userQuerySnapshot.docs[0]

      if (userSnapshot?.exists && userConverter) {
        return userSnapshot.data()
      }

      return null
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const accountQuery = Accounts.where("provider", "==", provider)
        .where("providerAccountId", "==", providerAccountId)
        .limit(1)

      const accountQuerySnapshot = await accountQuery.get()
      const accountSnapshot = accountQuerySnapshot.docs[0]

      if (accountSnapshot?.exists) {
        const { userId } = accountSnapshot.data()
        const userDoc = await Users.doc(userId).get()

        if (userDoc.exists && userConverter) {
          return userDoc.data()
        }
      }

      return null
    },

    async updateUser(partialUser) {
      const userRef = Users.doc(partialUser.id)

      await userRef.set(partialUser, { merge: true })

      const userSnapshot = await userRef.get()

      if (userSnapshot.exists && userConverter) {
        return userSnapshot.data()
      }

      throw new Error("[updateUser] Failed to update user")
    },

    async deleteUser(userId) {
      const userRef = Users.doc(userId)
      const accountsQuery = Accounts.where("userId", "==", userId)
      const sessionsQuery = Sessions.where("userId", "==", userId)

      db.runTransaction(async (transaction) => {
        const accounts = await accountsQuery.get()
        const sessions = await sessionsQuery.get()

        transaction.delete(userRef)

        accounts.forEach((account) => transaction.delete(account.ref))
        sessions.forEach((session) => transaction.delete(session.ref))
      })
    },

    async linkAccount(account) {
      const accountRef = await Accounts.add(account)
      const accountSnapshot = await accountRef.get()
      if (accountSnapshot.exists && accountConverter) {
        return accountSnapshot.data()
      }
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const accountQuery = Accounts.where("provider", "==", provider)
        .where("providerAccountId", "==", providerAccountId)
        .limit(1)

      const accountSnapshots = await accountQuery.get()
      const accountSnapshot = accountSnapshots.docs[0]
      if (accountSnapshot?.exists) {
        await accountSnapshot.ref.delete()
      }
    },

    async createSession(session) {
      //todo: check if `as any` is OK here
      const sessionRef = await Sessions.add(session as any)
      const sessionSnapshot = await sessionRef.get()

      if (sessionSnapshot.exists && sessionConverter) {
        return sessionSnapshot.data()
      }

      throw new Error("[createSession] Failed to create session")
    },

    async getSessionAndUser(sessionToken) {
      const sessionQuery = Sessions.where(
        "sessionToken",
        "==",
        sessionToken
      ).limit(1)

      const sessionSnapshots = await sessionQuery.get()
      const sessionSnapshot = sessionSnapshots.docs[0]

      if (sessionSnapshot?.exists && sessionConverter) {
        const session = sessionSnapshot.data()
        const userDoc = await Users.doc(session.userId).get()

        if (userDoc.exists && userConverter) {
          const user = userDoc.data()

          return { session, user }
        }
      }

      return null
    },

    async updateSession(partialSession) {
      const sessionQuery = Sessions.where(
        "sessionToken",
        "==",
        partialSession.sessionToken
      ).limit(1)

      const sessionSnapshots = await sessionQuery.get()
      const sessionSnapshot = sessionSnapshots.docs[0]

      if (sessionSnapshot?.exists) {
        await sessionSnapshot.ref.set(partialSession, {
          merge: true,
        })

        const sessionDoc = await sessionSnapshot.ref.get()

        if (sessionDoc?.exists && sessionConverter) {
          const session = sessionDoc.data()

          return session
        }
      }

      return null
    },

    async deleteSession(sessionToken) {
      const sessionQuery = Sessions.where(
        "sessionToken",
        "==",
        sessionToken
      ).limit(1)

      const sessionSnapshots = await sessionQuery.get()
      const sessionSnapshot = sessionSnapshots.docs[0]
      if (sessionSnapshot?.exists) {
        await sessionSnapshot.ref.delete()
      }
    },

    async createVerificationToken(verificationToken) {
      //todo: check if `as any` is OK here
      const verificationTokenRef = await VerificationTokens.add(
        verificationToken as any
      )

      const verificationTokenSnapshot = await verificationTokenRef.get()

      if (verificationTokenSnapshot.exists && verificationTokenConverter) {
        const { id, ...verificationToken } = verificationTokenSnapshot.data()

        return verificationToken
      }
    },

    async useVerificationToken({ identifier, token }) {
      const verificationTokensQuery = VerificationTokens.where(
        "identifier",
        "==",
        identifier
      )
        .where("token", "==", token)
        .limit(1)

      const verificationTokenSnapshots = await verificationTokensQuery.get()
      const verificationTokenSnapshot = verificationTokenSnapshots.docs[0]

      if (verificationTokenSnapshot?.exists && verificationTokenConverter) {
        await verificationTokenSnapshot.ref.delete()

        const { id, ...verificationToken } = verificationTokenSnapshot.data()

        return verificationToken
      }

      return null
    },
  }
}
