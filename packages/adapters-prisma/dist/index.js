"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAdapter = void 0;
const crypto_1 = require("crypto");
const PrismaAdapter = (prisma) => {
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
                displayName: "PRISMA",
                createUser(profile) {
                    var _a, _b;
                    return prisma.user.create({
                        data: {
                            name: profile.name,
                            email: profile.email,
                            image: profile.image,
                            emailVerified: (_b = (_a = profile.emailVerified) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
                        },
                    });
                },
                getUser(id) {
                    return prisma.user.findUnique({
                        where: { id },
                    });
                },
                getUserByEmail(email) {
                    if (!email)
                        return Promise.resolve(null);
                    return prisma.user.findUnique({ where: { email } });
                },
                async getUserByProviderAccountId(providerId, providerAccountId) {
                    var _a;
                    const account = await prisma.account.findUnique({
                        where: {
                            providerId_providerAccountId: { providerId, providerAccountId },
                        },
                        select: { user: true },
                    });
                    return (_a = account === null || account === void 0 ? void 0 : account.user) !== null && _a !== void 0 ? _a : null;
                },
                updateUser(user) {
                    var _a, _b;
                    return prisma.user.update({
                        where: { id: user.id },
                        data: {
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            emailVerified: (_b = (_a = user.emailVerified) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
                        },
                    });
                },
                async deleteUser(userId) {
                    await prisma.user.delete({
                        where: { id: userId },
                    });
                },
                async linkAccount(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
                    await prisma.account.create({
                        data: {
                            userId,
                            providerId,
                            providerType,
                            providerAccountId,
                            refreshToken,
                            accessToken,
                            accessTokenExpires,
                        },
                    });
                },
                async unlinkAccount(_, providerId, providerAccountId) {
                    await prisma.account.delete({
                        where: {
                            providerId_providerAccountId: { providerId, providerAccountId },
                        },
                    });
                },
                createSession(user) {
                    return prisma.session.create({
                        data: {
                            userId: user.id,
                            expires: new Date(Date.now() + sessionMaxAge),
                            sessionToken: crypto_1.randomBytes(32).toString("hex"),
                            accessToken: crypto_1.randomBytes(32).toString("hex"),
                        },
                    });
                },
                async getSession(sessionToken) {
                    const session = await prisma.session.findUnique({
                        where: { sessionToken },
                    });
                    if (session && session.expires < new Date()) {
                        await prisma.session.delete({ where: { sessionToken } });
                        return null;
                    }
                    return session;
                },
                async updateSession(session, force) {
                    if (!force &&
                        Number(session.expires) - sessionMaxAge + sessionUpdateAge >
                            Date.now()) {
                        return null;
                    }
                    return await prisma.session.update({
                        where: { id: session.id },
                        data: {
                            expires: new Date(Date.now() + sessionMaxAge),
                        },
                    });
                },
                async deleteSession(sessionToken) {
                    await prisma.session.delete({ where: { sessionToken } });
                },
                async createVerificationRequest(identifier, url, token, _, provider) {
                    await prisma.verificationRequest.create({
                        data: {
                            identifier,
                            token: hashToken(token),
                            expires: new Date(Date.now() + provider.maxAge * 1000),
                        },
                    });
                    await provider.sendVerificationRequest({
                        identifier,
                        url,
                        token,
                        baseUrl: appOptions.baseUrl,
                        provider,
                    });
                },
                async getVerificationRequest(identifier, token) {
                    const hashedToken = hashToken(token);
                    const verificationRequest = await prisma.verificationRequest.findUnique({
                        where: { identifier_token: { identifier, token: hashedToken } },
                    });
                    if (verificationRequest && verificationRequest.expires < new Date()) {
                        await prisma.verificationRequest.delete({
                            where: { identifier_token: { identifier, token: hashedToken } },
                        });
                        return null;
                    }
                    return verificationRequest;
                },
                async deleteVerificationRequest(identifier, token) {
                    await prisma.verificationRequest.delete({
                        where: {
                            identifier_token: { identifier, token: hashToken(token) },
                        },
                    });
                },
            };
        },
    };
};
exports.PrismaAdapter = PrismaAdapter;
