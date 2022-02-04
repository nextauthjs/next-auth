"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.updateSession = exports.getSession = exports.createSession = exports.sessionReturn = void 0;
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
exports.sessionReturn = `
  {
    userId: u.id,
    id: s.id,
    expires: s.expires.epochMillis, 
    accessToken: s.accessToken,
    sessionToken: s.sessionToken
  } AS session
`;
const createSession = async (neo4jSession, user, sessionMaxAge) => {
    var _a;
    let result;
    try {
        result = await neo4jSession.writeTransaction((tx) => {
            var _a;
            return tx.run(`
        MATCH (u:User { id: $userId })
        CREATE (s:Session  {
          id : apoc.create.uuid(),
          expires : datetime($expires),
          sessionToken : $sessionToken,
          accessToken : $accessToken
        })
        CREATE (u)-[:HAS_SESSION]->(s)
        RETURN ${exports.sessionReturn}
        `, {
                userId: user.id,
                expires: (_a = new Date(Date.now() + sessionMaxAge)) === null || _a === void 0 ? void 0 : _a.toISOString(),
                sessionToken: crypto_1.randomBytes(32).toString("hex"),
                accessToken: crypto_1.randomBytes(32).toString("hex"),
            });
        });
    }
    catch (error) {
        console.error(error);
        return null;
    }
    const session = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("session");
    return session
        ? {
            ...session,
            expires: utils_1.neo4jEpochToDate(session.expires),
        }
        : null;
};
exports.createSession = createSession;
const getSession = async (neo4jSession, sessionToken) => {
    var _a;
    const result = await neo4jSession.readTransaction((tx) => tx.run(`
      MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $sessionToken })
      RETURN ${exports.sessionReturn}
      `, { sessionToken }));
    let session = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("session");
    if (!session)
        return null;
    session = {
        ...session,
        expires: utils_1.neo4jEpochToDate(session.expires),
    };
    if (session.expires < new Date()) {
        await neo4jSession.writeTransaction((tx) => tx.run(`
      MATCH (s:Session { id: $id })
      DETACH DELETE s
      RETURN count(s) 
      `, { id: session.id }));
        return null;
    }
    return session;
};
exports.getSession = getSession;
const updateSession = async (neo4jSession, session, force, sessionMaxAge, sessionUpdateAge) => {
    var _a;
    if (!force &&
        Number(session.expires) - sessionMaxAge + sessionUpdateAge > Date.now()) {
        return null;
    }
    const result = await neo4jSession.writeTransaction((tx) => tx.run(`
    MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $sessionToken })
    SET s.expires = datetime($expires)
    RETURN ${exports.sessionReturn}
    `, {
        sessionToken: session.sessionToken,
        expires: new Date(Date.now() + sessionMaxAge).toISOString(),
    }));
    const updatedSession = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("session");
    return updatedSession
        ? {
            ...updatedSession,
            expires: utils_1.neo4jEpochToDate(updatedSession.expires),
        }
        : null;
};
exports.updateSession = updateSession;
const deleteSession = async (neo4jSession, sessionToken) => {
    await neo4jSession.writeTransaction((tx) => tx.run(`
    MATCH (s:Session { sessionToken: $sessionToken })
    DETACH DELETE s
    RETURN count(s)
    `, { sessionToken }));
};
exports.deleteSession = deleteSession;
