import { runBasicTests } from "@next-auth/adapter-test";
import type {
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters";
import {
  defaultCollections,
  format,
  MongooseAdapter,
  SchemaUser,
  SchemaAccount,
  SchemaSession,
  SchemaVerificationToken,
} from "../src";
import mongoose, { model } from "mongoose";

const name = "model-test";
const clientPromise = mongoose.connect(`mongodb://localhost:27017/${name}`);

const collections = { ...defaultCollections, Users: "some_userz" };

const UserModel = model<AdapterUser>("User", SchemaUser, collections.Users);
const AccountModel = model<AdapterAccount>(
  "Account",
  SchemaAccount,
  collections.Accounts
);
const SessionModel = model<AdapterSession>(
  "Session",
  SchemaSession,
  collections.Sessions
);
const VerificationTokenModel = model<VerificationToken>(
  "VerificationToken",
  SchemaVerificationToken,
  collections.VerificationTokens
);

runBasicTests({
  adapter: MongooseAdapter(clientPromise, { collections }),
  db: {
    async disconnect() {
      await (await clientPromise).connection.db.dropDatabase();
      await (await clientPromise).connection.close();
    },
    async user(id) {
      const user = await UserModel.findById(id).lean();
      if (!user) return null;
      return format.from(user);
    },
    async account(provider_providerAccountId) {
      const account = await AccountModel.findOne(
        provider_providerAccountId
      ).lean();
      if (!account) return null;
      return format.from(account);
    },
    async session(sessionToken) {
      const session = await SessionModel.findOne({ sessionToken }).lean();
      if (!session) return null;
      return format.from(session);
    },
    async verificationToken(identifier_token) {
      const token = await VerificationTokenModel.findOne(
        identifier_token
      ).lean();
      if (!token) return null;
      const { _id, ...rest } = token;
      return rest;
    },
  },
});
