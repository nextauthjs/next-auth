"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = __importStar(require("firebase-admin"));
var crypto_1 = require("crypto");
var Adapter = function (config, _options) {
    if (_options === void 0) { _options = {}; }
    function getAdapter(appOptions) {
        return __awaiter(this, void 0, void 0, function () {
            // Display debug output if debug option enabled
            function _debug() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (appOptions && appOptions.debug) {
                    console.log.apply(console, __spreadArrays(["[next-auth][firebase][debug]"], args));
                }
            }
            function createUser(profile) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, usersCollection, newUserRef, newUserSnapshot, newUser, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("createUser", profile);
                                firestoreAdmin = config.firestoreAdmin, usersCollection = config.usersCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(usersCollection)
                                        .add({
                                        name: profile.name,
                                        email: profile.email,
                                        image: profile.image,
                                        emailVerified: profile.emailVerified
                                            ? profile.emailVerified
                                            : false,
                                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                    })];
                            case 2:
                                newUserRef = _a.sent();
                                return [4 /*yield*/, newUserRef.get()];
                            case 3:
                                newUserSnapshot = _a.sent();
                                newUser = __assign(__assign({}, newUserSnapshot.data()), { id: newUserSnapshot.id });
                                return [2 /*return*/, newUser];
                            case 4:
                                error_1 = _a.sent();
                                console.error("CREATE_USER", error_1);
                                return [2 /*return*/, Promise.reject(new Error("CREATE_USER"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function getUser(id) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, usersCollection, snapshot, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("getUser", id);
                                firestoreAdmin = config.firestoreAdmin, usersCollection = config.usersCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(usersCollection)
                                        .doc(id)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                return [2 /*return*/, __assign(__assign({}, snapshot.data()), { id: snapshot.id })];
                            case 3:
                                error_2 = _a.sent();
                                console.error("GET_USER", error_2.message);
                                return [2 /*return*/, Promise.reject(new Error("GET_USER"))];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function getUserByEmail(email) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, usersCollection, snapshot, user, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("getUserByEmail", email);
                                if (!email)
                                    return [2 /*return*/, Promise.resolve(null)];
                                firestoreAdmin = config.firestoreAdmin, usersCollection = config.usersCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(usersCollection)
                                        .where("email", "==", email)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                if (snapshot.empty)
                                    return [2 /*return*/, Promise.resolve(null)];
                                user = __assign(__assign({}, snapshot.docs[0].data()), { id: snapshot.docs[0].id });
                                return [2 /*return*/, user];
                            case 3:
                                error_3 = _a.sent();
                                console.error("GET_USER_BY_EMAIL", error_3.message);
                                return [2 /*return*/, Promise.reject(new Error("GET_USER_BY_EMAIL"))];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function getUserByProviderAccountId(providerId, providerAccountId) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, accountsCollection, usersCollection, accountSnapshot, userId, userSnapshot, user, error_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("getUserByProviderAccountId", providerId, providerAccountId);
                                firestoreAdmin = config.firestoreAdmin, accountsCollection = config.accountsCollection, usersCollection = config.usersCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(accountsCollection)
                                        .where("providerId", "==", providerId)
                                        .where("providerAccountId", "==", providerAccountId)
                                        .limit(1)
                                        .get()];
                            case 2:
                                accountSnapshot = _a.sent();
                                if (accountSnapshot.empty)
                                    return [2 /*return*/, null];
                                userId = accountSnapshot.docs[0].data().userId;
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(usersCollection)
                                        .doc(userId)
                                        .get()];
                            case 3:
                                userSnapshot = _a.sent();
                                user = __assign(__assign({}, userSnapshot.data()), { id: userSnapshot.id });
                                return [2 /*return*/, user];
                            case 4:
                                error_4 = _a.sent();
                                console.error("GET_USER_BY_PROVIDER_ACCOUNT_ID", error_4.message);
                                return [2 /*return*/, Promise.reject(new Error("GET_USER_BY_PROVIDER_ACCOUNT_ID"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function updateUser(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, usersCollection, updatedUser, error_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("updateUser", user);
                                firestoreAdmin = config.firestoreAdmin, usersCollection = config.usersCollection;
                                updatedUser = __assign(__assign({}, user), { updatedAt: admin.firestore.FieldValue.serverTimestamp() });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(usersCollection)
                                        .doc(user.id)
                                        .update(updatedUser)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, updatedUser];
                            case 3:
                                error_5 = _a.sent();
                                console.error("UPDATE_USER", error_5.message);
                                return [2 /*return*/, Promise.reject(new Error("UPDATE_USER"))];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function deleteUser(userId) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, usersCollection, error_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("deleteUser", userId);
                                firestoreAdmin = config.firestoreAdmin, usersCollection = config.usersCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, firestoreAdmin.collection(usersCollection).doc(userId).delete()];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                error_6 = _a.sent();
                                console.error("DELETE_USER", error_6.message);
                                return [2 /*return*/, Promise.reject(new Error("DELETE_USER"))];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function linkAccount(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, accountsCollection, newAccountData, accountRef, accountSnapshot, error_7;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("linkAccount", userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires);
                                firestoreAdmin = config.firestoreAdmin, accountsCollection = config.accountsCollection;
                                newAccountData = removeUndefinedValues({
                                    userId: userId,
                                    providerId: providerId,
                                    providerType: providerType,
                                    providerAccountId: providerAccountId,
                                    refreshToken: refreshToken,
                                    accessToken: accessToken,
                                    accessTokenExpires: accessTokenExpires,
                                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(accountsCollection)
                                        .add(newAccountData)];
                            case 2:
                                accountRef = _a.sent();
                                return [4 /*yield*/, accountRef.get()];
                            case 3:
                                accountSnapshot = _a.sent();
                                return [2 /*return*/, accountSnapshot.data()];
                            case 4:
                                error_7 = _a.sent();
                                console.error("LINK_ACCOUNT", error_7.message);
                                return [2 /*return*/, Promise.reject(new Error("LINK_ACCOUNT"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function unlinkAccount(userId, providerId, providerAccountId) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, accountsCollection, snapshot, accountId, error_8;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("unlinkAccount", userId, providerId, providerAccountId);
                                firestoreAdmin = config.firestoreAdmin, accountsCollection = config.accountsCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(accountsCollection)
                                        .where("userId", "==", userId)
                                        .where("providerId", "==", providerId)
                                        .where("providerAccountId", "==", providerAccountId)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                accountId = snapshot.docs[0].id;
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(accountsCollection)
                                        .doc(accountId)
                                        .delete()];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_8 = _a.sent();
                                console.error("UNLINK_ACCOUNT", error_8.message);
                                return [2 /*return*/, Promise.reject(new Error("UNLINK_ACCOUNT"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function createSession(user) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, sessionsCollection, expires, expireDate, newSessionRef, newSessionSnapshot, error_9;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("createSession", user);
                                firestoreAdmin = config.firestoreAdmin, sessionsCollection = config.sessionsCollection;
                                expires = null;
                                if (SESSION_MAX_AGE) {
                                    expireDate = new Date();
                                    expires = expireDate.setTime(expireDate.getTime() + SESSION_MAX_AGE);
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .add({
                                        userId: user.id,
                                        expires: expires,
                                        sessionToken: crypto_1.randomBytes(32).toString("hex"),
                                        accessToken: crypto_1.randomBytes(32).toString("hex"),
                                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                    })];
                            case 2:
                                newSessionRef = _a.sent();
                                return [4 /*yield*/, newSessionRef.get()];
                            case 3:
                                newSessionSnapshot = _a.sent();
                                return [2 /*return*/, __assign(__assign({}, newSessionSnapshot.data()), { id: newSessionSnapshot.id })];
                            case 4:
                                error_9 = _a.sent();
                                console.error("CREATE_SESSION", error_9.message);
                                return [2 /*return*/, Promise.reject(new Error("CREATE_SESSION"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function getSession(sessionToken) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, sessionsCollection, snapshot, session, error_10;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("getSession", sessionToken);
                                firestoreAdmin = config.firestoreAdmin, sessionsCollection = config.sessionsCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 5, , 6]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .where("sessionToken", "==", sessionToken)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                if (snapshot.empty)
                                    return [2 /*return*/, null];
                                session = __assign(__assign({}, snapshot.docs[0].data()), { id: snapshot.docs[0].id });
                                if (!(!snapshot.empty &&
                                    session.expires &&
                                    new Date() > session.expires)) return [3 /*break*/, 4];
                                // delete the session
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .doc(snapshot.docs[0].id)
                                        .delete()];
                            case 3:
                                // delete the session
                                _a.sent();
                                _a.label = 4;
                            case 4: 
                            // return already existing session
                            return [2 /*return*/, session];
                            case 5:
                                error_10 = _a.sent();
                                console.error("GET_SESSION", error_10.message);
                                return [2 /*return*/, Promise.reject(new Error("GET_SESSION"))];
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            }
            function updateSession(session, force) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, sessionsCollection, shouldUpdate, dateSessionIsDueToBeUpdated, currentDate, newExpiryDate, updatedSessionData, error_11;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("updateSession", session);
                                firestoreAdmin = config.firestoreAdmin, sessionsCollection = config.sessionsCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                shouldUpdate = SESSION_MAX_AGE &&
                                    (SESSION_UPDATE_AGE || SESSION_UPDATE_AGE === 0) &&
                                    session.expires;
                                if (!shouldUpdate && !force)
                                    return [2 /*return*/, null];
                                dateSessionIsDueToBeUpdated = new Date(session.expires);
                                dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - SESSION_MAX_AGE);
                                dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + SESSION_UPDATE_AGE);
                                currentDate = new Date();
                                if (currentDate < dateSessionIsDueToBeUpdated && !force)
                                    return [2 /*return*/, null];
                                newExpiryDate = new Date();
                                newExpiryDate.setTime(newExpiryDate.getTime() + SESSION_MAX_AGE);
                                updatedSessionData = __assign(__assign({}, session), { expires: newExpiryDate, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
                                // Update the item in the database
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .doc(session.id)
                                        .update(updatedSessionData)];
                            case 2:
                                // Update the item in the database
                                _a.sent();
                                return [2 /*return*/, updatedSessionData];
                            case 3:
                                error_11 = _a.sent();
                                console.error("UPDATE_SESSION", error_11.message);
                                return [2 /*return*/, Promise.reject(new Error("UPDATE_SESSION"))];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            function deleteSession(sessionToken) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, sessionsCollection, snapshot, sessionId, error_12;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("deleteSession", sessionToken);
                                firestoreAdmin = config.firestoreAdmin, sessionsCollection = config.sessionsCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .where("sessionToken", "==", sessionToken)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                if (snapshot.empty)
                                    return [2 /*return*/];
                                sessionId = snapshot.docs[0].id;
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(sessionsCollection)
                                        .doc(sessionId)
                                        .delete()];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_12 = _a.sent();
                                console.error("DELETE_SESSION", error_12.message);
                                return [2 /*return*/, Promise.reject(new Error("DELETE_SESSION"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            function createVerificationRequest(identifier, url, token, secret, provider) {
                var _a;
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, verificationRequestsCollection, baseUrl, sendVerificationRequest, maxAge, hashedToken, expires, dateExpires, newVerificationRequestRef, newVerificationRequestSnapshot, error_13;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _debug("createVerificationRequest", identifier);
                                firestoreAdmin = config.firestoreAdmin, verificationRequestsCollection = config.verificationRequestsCollection;
                                baseUrl = (_a = appOptions === null || appOptions === void 0 ? void 0 : appOptions.baseUrl) !== null && _a !== void 0 ? _a : '';
                                sendVerificationRequest = provider.sendVerificationRequest, maxAge = provider.maxAge;
                                hashedToken = crypto_1.createHash("sha256")
                                    .update("" + token + secret)
                                    .digest("hex");
                                expires = null;
                                if (maxAge) {
                                    dateExpires = new Date();
                                    dateExpires.setTime(dateExpires.getTime() + maxAge * 1000);
                                    expires = dateExpires;
                                }
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 5, , 6]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(verificationRequestsCollection)
                                        .add({
                                        identifier: identifier,
                                        token: hashedToken,
                                        expires: expires,
                                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                                    })];
                            case 2:
                                newVerificationRequestRef = _b.sent();
                                return [4 /*yield*/, newVerificationRequestRef.get()];
                            case 3:
                                newVerificationRequestSnapshot = _b.sent();
                                // With the verificationCallback on a provider, you can send an email, or queue
                                // an email to be sent, or perform some other action (e.g. send a text message)
                                return [4 /*yield*/, sendVerificationRequest({
                                        identifier: identifier,
                                        url: url,
                                        token: token,
                                        baseUrl: baseUrl,
                                        provider: provider,
                                    })];
                            case 4:
                                // With the verificationCallback on a provider, you can send an email, or queue
                                // an email to be sent, or perform some other action (e.g. send a text message)
                                _b.sent();
                                return [2 /*return*/, __assign(__assign({}, newVerificationRequestSnapshot.data()), { id: newVerificationRequestSnapshot.id })];
                            case 5:
                                error_13 = _b.sent();
                                console.error("CREATE_VERIFICATION_REQUEST", error_13.message);
                                return [2 /*return*/, Promise.reject(new Error("CREATE_VERIFICATION_REQUEST"))];
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            }
            function getVerificationRequest(identifier, token, secret, _provider) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, verificationRequestsCollection, hashedToken, snapshot, verificationRequest, error_14;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("getVerificationRequest", identifier, token);
                                firestoreAdmin = config.firestoreAdmin, verificationRequestsCollection = config.verificationRequestsCollection;
                                hashedToken = crypto_1.createHash("sha256")
                                    .update("" + token + secret)
                                    .digest("hex");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 5, , 6]);
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(verificationRequestsCollection)
                                        .where("token", "==", hashedToken)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                verificationRequest = __assign(__assign({}, snapshot.docs[0].data()), { id: snapshot.docs[0].id });
                                if (!(verificationRequest &&
                                    verificationRequest.expires &&
                                    new Date() > verificationRequest.expires)) return [3 /*break*/, 4];
                                // Delete verification entry so it cannot be used again
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(verificationRequestsCollection)
                                        .doc(verificationRequest.id)
                                        .delete()];
                            case 3:
                                // Delete verification entry so it cannot be used again
                                _a.sent();
                                return [2 /*return*/, null];
                            case 4: return [2 /*return*/, verificationRequest];
                            case 5:
                                error_14 = _a.sent();
                                console.error("GET_VERIFICATION_REQUEST", error_14.message);
                                return [2 /*return*/, Promise.reject(new Error("GET_VERIFICATION_REQUEST"))];
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            }
            function deleteVerificationRequest(identifier, token, secret, _provider) {
                return __awaiter(this, void 0, void 0, function () {
                    var firestoreAdmin, verificationRequestsCollection, hashedToken, snapshot, verificationRequestId, error_15;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _debug("deleteVerification", identifier, token);
                                firestoreAdmin = config.firestoreAdmin, verificationRequestsCollection = config.verificationRequestsCollection;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                hashedToken = crypto_1.createHash("sha256")
                                    .update("" + token + secret)
                                    .digest("hex");
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(verificationRequestsCollection)
                                        .where("token", "==", hashedToken)
                                        .limit(1)
                                        .get()];
                            case 2:
                                snapshot = _a.sent();
                                verificationRequestId = snapshot.docs[0].id;
                                return [4 /*yield*/, firestoreAdmin
                                        .collection(verificationRequestsCollection)
                                        .doc(verificationRequestId)
                                        .delete()];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_15 = _a.sent();
                                console.error("DELETE_VERIFICATION_REQUEST_ERROR", error_15.message);
                                return [2 /*return*/, Promise.reject(new Error("DELETE_VERIFICATION_REQUEST_ERROR"))];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
            var DEFAULT_SESSION_MAX_AGE, SESSION_MAX_AGE, SESSION_UPDATE_AGE;
            return __generator(this, function (_a) {
                if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
                    _debug("GET_ADAPTER", "Session expiry not configured (defaulting to 30 days");
                }
                DEFAULT_SESSION_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
                SESSION_MAX_AGE = appOptions && appOptions.session && appOptions.session.maxAge
                    ? appOptions.session.maxAge * 1000
                    : DEFAULT_SESSION_MAX_AGE;
                SESSION_UPDATE_AGE = appOptions && appOptions.session && appOptions.session.updateAge
                    ? appOptions.session.updateAge * 1000
                    : 0;
                return [2 /*return*/, Promise.resolve({
                        createUser: createUser,
                        getUser: getUser,
                        getUserByEmail: getUserByEmail,
                        getUserByProviderAccountId: getUserByProviderAccountId,
                        updateUser: updateUser,
                        deleteUser: deleteUser,
                        linkAccount: linkAccount,
                        unlinkAccount: unlinkAccount,
                        createSession: createSession,
                        getSession: getSession,
                        updateSession: updateSession,
                        deleteSession: deleteSession,
                        createVerificationRequest: createVerificationRequest,
                        getVerificationRequest: getVerificationRequest,
                        deleteVerificationRequest: deleteVerificationRequest,
                    })];
            });
        });
    }
    return {
        getAdapter: getAdapter,
    };
};
exports.default = Adapter;
// helpers
function removeUndefinedValues(obj) {
    Object.keys(obj).map(function (key) {
        if (typeof obj[key] === "undefined") {
            delete obj[key];
        }
    });
    return obj;
}
