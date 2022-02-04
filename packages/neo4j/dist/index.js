"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jAdapter = void 0;
const crypto_1 = require("crypto");
const user_1 = require("./user");
const account_1 = require("./account");
const session_1 = require("./session");
const verificationRequest_1 = require("./verificationRequest");
const Neo4jAdapter = (neo4jSession) => {
    return {
        async getAdapter({ session, secret, ...appOptions }) {
            const sessionMaxAge = session.maxAge * 1000; // default is 30 days
            const sessionUpdateAge = session.updateAge * 1000; // default is 1 day
            /**
             * @todo Move this to core package
             * @todo Use bcrypt or a more secure method
             */
            const hashToken = (token) => crypto_1.createHash("sha256").update(`${token}${secret}`).digest("hex");
            return {
                displayName: "NEO4J",
                async createUser(profile) {
                    return await user_1.createUser(neo4jSession, profile);
                },
                async getUser(id) {
                    return await user_1.getUser(neo4jSession, id);
                },
                async getUserByEmail(email) {
                    return await user_1.getUserByEmail(neo4jSession, email);
                },
                async getUserByProviderAccountId(providerId, providerAccountId) {
                    return await user_1.getUserByProviderAccountId(neo4jSession, providerId, providerAccountId);
                },
                async updateUser(user) {
                    return await user_1.updateUser(neo4jSession, user);
                },
                async deleteUser(id) {
                    return await user_1.deleteUser(neo4jSession, id);
                },
                async linkAccount(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
                    return await account_1.linkAccount(neo4jSession, userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);
                },
                async unlinkAccount(_, providerId, providerAccountId) {
                    return await account_1.unlinkAccount(neo4jSession, _, providerId, providerAccountId);
                },
                async createSession(user) {
                    return await session_1.createSession(neo4jSession, user, sessionMaxAge);
                },
                async getSession(sessionToken) {
                    return await session_1.getSession(neo4jSession, sessionToken);
                },
                async updateSession(session, force) {
                    return await session_1.updateSession(neo4jSession, session, force, sessionMaxAge, sessionUpdateAge);
                },
                async deleteSession(sessionToken) {
                    return await session_1.deleteSession(neo4jSession, sessionToken);
                },
                async createVerificationRequest(identifier, url, token, _, provider) {
                    return await verificationRequest_1.createVerificationRequest(neo4jSession, identifier, url, token, _, provider, hashToken, appOptions.baseUrl);
                },
                async getVerificationRequest(identifier, token) {
                    return await verificationRequest_1.getVerificationRequest(neo4jSession, identifier, token, hashToken);
                },
                async deleteVerificationRequest(identifier, token) {
                    return await verificationRequest_1.deleteVerificationRequest(neo4jSession, identifier, token, hashToken);
                },
            };
        },
    };
};
exports.Neo4jAdapter = Neo4jAdapter;
