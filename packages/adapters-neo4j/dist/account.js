"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkAccount = exports.linkAccount = exports.accountReturn = void 0;
const utils_1 = require("./utils");
exports.accountReturn = `
  {
    userId: u.id,
    providerId: a.providerId,
    providerAccountId: a.providerAccountId,
    providerType: a.providerType,
    refreshToken: a.refreshToken,
    accessToken: a.accessToken,
    accessTokenExpires: a.accessTokenExpires
  } AS account
`;
const linkAccount = async (neo4jSession, userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) => {
    var _a;
    const result = await neo4jSession.writeTransaction((tx) => {
        var _a;
        return tx.run(`
      MATCH (u:User { id: $userId })
      // Use merge here because composite of
      // providerId + providerAccountId is unique
      MERGE (a:Account { 
        providerId: $providerId, 
        providerAccountId: $providerAccountId 
      })
      SET 
        a.providerType       = $providerType,
        a.refreshToken       = $refreshToken,
        a.accessToken        = $accessToken,
        a.accessTokenExpires = datetime($accessTokenExpires)
      
      MERGE (u)-[:HAS_ACCOUNT]->(a)

      RETURN ${exports.accountReturn}
      `, {
            userId,
            providerId,
            providerType,
            providerAccountId,
            refreshToken,
            accessToken,
            accessTokenExpires: (_a = accessTokenExpires === null || accessTokenExpires === void 0 ? void 0 : accessTokenExpires.toISOString()) !== null && _a !== void 0 ? _a : null,
        });
    });
    const account = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("account");
    return account
        ? {
            ...account,
            accessTokenExpires: utils_1.neo4jEpochToDate(account.accessTokenExpires),
        }
        : null;
};
exports.linkAccount = linkAccount;
const unlinkAccount = async (neo4jSession, _, providerId, providerAccountId) => {
    await neo4jSession.writeTransaction((tx) => tx.run(`
      MATCH (a:Account { 
        providerId: $providerId, 
        providerAccountId: $providerAccountId 
      })
      DETACH DELETE a
      RETURN count(a)
      `, {
        providerId,
        providerAccountId,
    }));
};
exports.unlinkAccount = unlinkAccount;
