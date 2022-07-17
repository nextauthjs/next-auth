import { runBasicTests } from "@next-auth/adapter-test"
import { FirestoreAdapter } from "../src"

import { getFirestore, connectFirestoreEmulator, terminate, collection, query, where, limit, getDocs, getDoc, doc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { getConverter } from "../src/converter";
import type { AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import type { Account } from "next-auth";

const app = initializeApp({ projectId: "next-auth-test" });
const firestore = getFirestore(app);

connectFirestoreEmulator(firestore, 'localhost', 8080);

type IndexableObject = Record<string, unknown>;

const Users = collection(firestore, 'users').withConverter(getConverter<AdapterUser & IndexableObject>());
const Sessions = collection(firestore, 'sessions').withConverter(getConverter<AdapterSession & IndexableObject>());
const Accounts = collection(firestore, 'accounts').withConverter(getConverter<Account>());
const VerificationTokens = collection(firestore, 'verificationTokens').withConverter(getConverter<VerificationToken & IndexableObject>({ excludeId: true }));

runBasicTests({
  adapter: FirestoreAdapter({ projectId: "next-auth-test" }),
  db: {
    async disconnect() {
      await terminate(firestore);
    },
    async session(sessionToken) {
      const snapshotQuery = query(Sessions, where("sessionToken", "==", sessionToken), limit(1));
      const snapshots = await getDocs(snapshotQuery);
      const snapshot = snapshots.docs[0];

      if (snapshot?.exists() && Sessions.converter) {
        const session = Sessions.converter.fromFirestore(snapshot);

        return session;
      }

      return null;
    },
    async user(id) {
      const snapshot = await getDoc(doc(Users, id));

      if (snapshot?.exists() && Users.converter) {
        const user = Users.converter.fromFirestore(snapshot);

        return user;
      }

      return null;
    },
    async account({ provider, providerAccountId }) {
      const snapshotQuery = query(Accounts, where("provider", "==", provider), where("providerAccountId", "==", providerAccountId), limit(1));
      const snapshots = await getDocs(snapshotQuery);
      const snapshot = snapshots.docs[0];

      if (snapshot?.exists() && Accounts.converter) {
        const account = Accounts.converter.fromFirestore(snapshot);

        return account;
      }

      return null;
    },
    async verificationToken({ identifier, token }) {
      const snapshotQuery = query(VerificationTokens, where("identifier", "==", identifier), where("token", "==", token), limit(1));
      const snapshots = await getDocs(snapshotQuery);
      const snapshot = snapshots.docs[0];

      if (snapshot?.exists() && VerificationTokens.converter) {
        const verificationToken = VerificationTokens.converter.fromFirestore(snapshot);

        return verificationToken;
      }
    },
  },
})
