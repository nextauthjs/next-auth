"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisJSONAdapter = exports.hydrateDates = exports.defaultOptions = void 0;
const uuid_1 = require("uuid");
exports.defaultOptions = {
    baseKeyPrefix: "",
    accountKeyPrefix: "user:account:",
    accountByUserIdPrefix: "user:account:by-user-id:",
    emailKeyPrefix: "user:email:",
    sessionKeyPrefix: "user:session:",
    sessionByUserIdKeyPrefix: "user:session:by-user-id:",
    userKeyPrefix: "user:",
    verificationTokenKeyPrefix: "user:token:",
};
const isoDateRE = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function isDate(value) {
    return value && isoDateRE.test(value) && !isNaN(Date.parse(value));
}
function hydrateDates(json) {
    return Object.entries(json).reduce((acc, [key, val]) => {
        acc[key] = isDate(val) ? new Date(val) : val;
        return acc;
    }, {});
}
exports.hydrateDates = hydrateDates;
function RedisJSONAdapter(client, options = {}) {
    const mergedOptions = {
        ...exports.defaultOptions,
        ...options,
    };
    const { baseKeyPrefix } = mergedOptions;
    const accountKeyPrefix = baseKeyPrefix + mergedOptions.accountKeyPrefix;
    const accountByUserIdPrefix = baseKeyPrefix + mergedOptions.accountByUserIdPrefix;
    const emailKeyPrefix = baseKeyPrefix + mergedOptions.emailKeyPrefix;
    const sessionKeyPrefix = baseKeyPrefix + mergedOptions.sessionKeyPrefix;
    const sessionByUserIdKeyPrefix = baseKeyPrefix + mergedOptions.sessionByUserIdKeyPrefix;
    const userKeyPrefix = baseKeyPrefix + mergedOptions.userKeyPrefix;
    const verificationTokenKeyPrefix = baseKeyPrefix + mergedOptions.verificationTokenKeyPrefix;
    const db = (async () => {
        if (!client.isReady) {
            await client.connect();
        }
        return client;
    })();
    const setObjectAsJson = async (key, obj) => await (await db).json.set(key, '$', obj);
    const setAccount = async (id, account) => {
        const accountKey = accountKeyPrefix + id;
        await setObjectAsJson(accountKey, account);
        await (await db).set(accountByUserIdPrefix + account.userId, accountKey);
        return hydrateDates(account);
    };
    const getAccount = async (id) => {
        const account = await (await db).json.get(accountKeyPrefix + id);
        if (!account)
            return null;
        return hydrateDates(account);
    };
    const setSession = async (id, session) => {
        const sessionKey = sessionKeyPrefix + id;
        await setObjectAsJson(sessionKey, session);
        await (await db).set(sessionByUserIdKeyPrefix + session.userId, sessionKey);
        return hydrateDates(session);
    };
    const getSession = async (id) => {
        const session = await (await db).json.get(sessionKeyPrefix + id);
        if (!session)
            return null;
        return hydrateDates(session);
    };
    const setUser = async (id, user) => {
        await setObjectAsJson(userKeyPrefix + id, user);
        await (await db).set(`${emailKeyPrefix}${user.email}`, id);
        return hydrateDates(user);
    };
    const getUser = async (id) => {
        const user = await (await db).json.get(userKeyPrefix + id);
        if (!user)
            return null;
        return hydrateDates(user);
    };
    return {
        async createUser(user) {
            const id = (0, uuid_1.v4)();
            // TypeScript thinks the emailVerified field is missing
            // but all fields are copied directly from user, so it's there
            return await setUser(id, { ...user, id });
        },
        getUser,
        async getUserByEmail(email) {
            const userId = await (await db).get(emailKeyPrefix + email);
            if (!userId) {
                return null;
            }
            return await getUser(userId);
        },
        async getUserByAccount(account) {
            const dbAccount = await getAccount(`${account.provider}:${account.providerAccountId}`);
            if (!dbAccount)
                return null;
            return await getUser(dbAccount.userId);
        },
        async updateUser(updates) {
            const userId = updates.id;
            const user = await getUser(userId);
            return await setUser(userId, { ...user, ...updates });
        },
        async linkAccount(account) {
            const id = `${account.provider}:${account.providerAccountId}`;
            return await setAccount(id, { ...account, id });
        },
        createSession: (session) => setSession(session.sessionToken, session),
        async getSessionAndUser(sessionToken) {
            const session = await getSession(sessionToken);
            if (!session)
                return null;
            const user = await getUser(session.userId);
            if (!user)
                return null;
            return { session, user };
        },
        async updateSession(updates) {
            const session = await getSession(updates.sessionToken);
            if (!session)
                return null;
            return await setSession(updates.sessionToken, { ...session, ...updates });
        },
        async deleteSession(sessionToken) {
            await (await db).del(sessionKeyPrefix + sessionToken);
        },
        async createVerificationToken(verificationToken) {
            await setObjectAsJson(verificationTokenKeyPrefix +
                verificationToken.identifier +
                ":" +
                verificationToken.token, verificationToken);
            return verificationToken;
        },
        async useVerificationToken(verificationToken) {
            const tokenKey = verificationTokenKeyPrefix +
                verificationToken.identifier +
                ":" +
                verificationToken.token;
            const token = await (await db).json.get(tokenKey);
            if (!token)
                return null;
            await (await db).json.del(tokenKey);
            return hydrateDates(token);
        },
        async unlinkAccount(account) {
            const id = `${account.provider}:${account.providerAccountId}`;
            const dbAccount = await getAccount(id);
            if (!dbAccount)
                return;
            const accountKey = `${accountKeyPrefix}${id}`;
            await (await db).del([
                accountKey,
                `${accountByUserIdPrefix} + ${dbAccount.userId}`
            ]);
        },
        async deleteUser(userId) {
            const user = await getUser(userId);
            if (!user)
                return;
            const accountByUserKey = accountByUserIdPrefix + userId;
            const accountKey = await (await db).get(accountByUserKey);
            const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId;
            const sessionKey = await (await db).get(sessionByUserIdKey);
            await (await db).del([
                userKeyPrefix + userId,
                `${emailKeyPrefix}${user.email}`,
                accountKey,
                accountByUserKey,
                sessionKey,
                sessionByUserIdKey
            ]);
        },
    };
}
exports.RedisJSONAdapter = RedisJSONAdapter;
