import { runBasicTests } from "@next-auth/adapter-test";
import { defaultCollections, format, MongooseAdapter, _id } from "../src";
import mongoose from "mongoose";

const name = "custom-test";
const clientPromise = mongoose.connect(`mongodb://localhost:27017/${name}`);

const collections = { ...defaultCollections, Users: "some_userz" };

runBasicTests({
  adapter: MongooseAdapter(clientPromise, {
    collections,
  }),
  db: {
    async disconnect() {
      await (await clientPromise).connection.db.dropDatabase();
      await (await clientPromise).connection.close();
    },
    async user(id) {
      const user = await (await clientPromise).connection.db
        .collection(collections.Users)
        .findOne({ _id: _id(id) });

      if (!user) return null;
      return format.from(user);
    },
    async account(provider_providerAccountId) {
      const account = await (await clientPromise).connection.db
        .collection(collections.Accounts)
        .findOne(provider_providerAccountId);
      if (!account) return null;
      return format.from(account);
    },
    async session(sessionToken) {
      const session = await (await clientPromise).connection.db
        .collection(collections.Sessions)
        .findOne({ sessionToken });
      if (!session) return null;
      return format.from(session);
    },
    async verificationToken(identifier_token) {
      const token = await (await clientPromise).connection.db
        .collection(collections.VerificationTokens)
        .findOne(identifier_token);
      if (!token) return null;
      const { _id, ...rest } = token;
      return rest;
    },
  },
});
