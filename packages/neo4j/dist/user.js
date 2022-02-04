"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByProviderAccountId = exports.getUserByEmail = exports.getUser = exports.createUser = exports.userReturn = void 0;
const utils_1 = require("./utils");
exports.userReturn = `
  { 
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    emailVerified: u.emailVerified.epochMillis
  } AS user 
`;
const createUser = async (neo4jSession, profile) => {
    var _a;
    let user;
    try {
        const result = await neo4jSession.writeTransaction((tx) => {
            var _a, _b;
            return tx.run(`
        MERGE (u:User { email: $email })
        ON CREATE SET u.id = apoc.create.uuid()
        SET
          u.name= $name,
          u.image= $image,
          u.emailVerified= datetime($emailVerified)
        RETURN ${exports.userReturn}
        `, {
                name: profile.name,
                email: profile.email,
                image: profile.image,
                emailVerified: (_b = (_a = profile.emailVerified) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
            });
        });
        user = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("user");
    }
    catch (error) {
        console.error(error);
        return null;
    }
    return user
        ? {
            ...user,
            emailVerified: utils_1.neo4jEpochToDate(user.emailVerified),
        }
        : null;
};
exports.createUser = createUser;
const getUser = async (neo4jSession, id) => {
    var _a;
    const result = await neo4jSession.readTransaction((tx) => tx.run(`
    MATCH (u:User { id: $id })
    RETURN ${exports.userReturn} 
    `, { id }));
    const user = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("user");
    return user
        ? {
            ...user,
            emailVerified: utils_1.neo4jEpochToDate(user.emailVerified),
        }
        : null;
};
exports.getUser = getUser;
const getUserByEmail = async (neo4jSession, email) => {
    var _a;
    if (!email)
        return null;
    const result = await neo4jSession.readTransaction((tx) => tx.run(`
    MATCH (u:User { email: $email })
    RETURN ${exports.userReturn} 
    `, { email }));
    const user = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("user");
    return user
        ? {
            ...user,
            emailVerified: utils_1.neo4jEpochToDate(user.emailVerified),
        }
        : null;
};
exports.getUserByEmail = getUserByEmail;
const getUserByProviderAccountId = async (neo4jSession, providerId, providerAccountId) => {
    var _a;
    const result = await neo4jSession.readTransaction((tx) => tx.run(`
      MATCH (u:User)-[:HAS_ACCOUNT]->(a:Account {
        providerId: $providerId, 
        providerAccountId: $providerAccountId
      })
      RETURN ${exports.userReturn} 
      `, { providerId, providerAccountId }));
    const user = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("user");
    return user
        ? {
            ...user,
            emailVerified: utils_1.neo4jEpochToDate(user.emailVerified),
        }
        : null;
};
exports.getUserByProviderAccountId = getUserByProviderAccountId;
const updateUser = async (neo4jSession, user) => {
    var _a;
    let result;
    try {
        result = await neo4jSession.writeTransaction((tx) => {
            var _a, _b;
            return tx.run(`
        MATCH (u:User { id: $id })
        SET 
        u.name          = $name,
        u.email         = $email,
        u.image         = $image,
        u.emailVerified = datetime($emailVerified)
        RETURN ${exports.userReturn}
        `, {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                emailVerified: (_b = (_a = user.emailVerified) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
            });
        });
    }
    catch (error) {
        console.error(error);
        return null;
    }
    const updatedUser = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("user");
    return updatedUser
        ? {
            ...updatedUser,
            emailVerified: utils_1.neo4jEpochToDate(updatedUser.emailVerified),
        }
        : null;
};
exports.updateUser = updateUser;
const deleteUser = async (neo4jSession, id) => {
    await neo4jSession.writeTransaction((tx) => tx.run(`
      MATCH (u:User { id: $id })
      DETACH DELETE u
      RETURN count(u)
    `, { id }));
};
exports.deleteUser = deleteUser;
