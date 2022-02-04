"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVerificationRequest = exports.getVerificationRequest = exports.createVerificationRequest = exports.verificationRequestReturn = void 0;
const utils_1 = require("./utils");
exports.verificationRequestReturn = `
  {
    identifier: v.identifier,
    token: v.token,
    expires: v.expires.epochMillis 
  } AS verificationRequest 
`;
const createVerificationRequest = async (neo4jSession, identifier, url, token, _, provider, hashToken, // TODO: correct type
baseUrl // TODO: should I import just this or all of appOptions for future proofing?
) => {
    const hashedToken = hashToken(token);
    await neo4jSession.writeTransaction((tx) => tx.run(`
    // Use merge here because composite of
    // identifier + token is unique
    MERGE (v:VerificationRequest {
      identifier: $identifier,
      token: $token 
    })
    SET 
      v.expires = datetime($expires),
      v.token   = $token

    RETURN ${exports.verificationRequestReturn}
    `, {
        identifier,
        token: hashedToken,
        expires: new Date(Date.now() + provider.maxAge * 1000).toISOString(),
    }));
    // TODO: should we check it created ok?
    // if (!result?.records[0]?.get("verificationRequest")) throw "createVerificationRequest: "
    await provider.sendVerificationRequest({
        identifier,
        url,
        token,
        baseUrl,
        provider,
    });
};
exports.createVerificationRequest = createVerificationRequest;
const getVerificationRequest = async (neo4jSession, identifier, token, hashToken // TODO: correct type
) => {
    var _a;
    const hashedToken = hashToken(token);
    const result = await neo4jSession.readTransaction((tx) => tx.run(`
    MATCH (v:VerificationRequest {
      identifier: $identifier,
      token: $token 
    })
    RETURN ${exports.verificationRequestReturn}
    `, {
        identifier,
        token: hashedToken,
    }));
    const verificationRequest = (_a = result === null || result === void 0 ? void 0 : result.records[0]) === null || _a === void 0 ? void 0 : _a.get("verificationRequest");
    return verificationRequest
        ? {
            ...verificationRequest,
            expires: utils_1.neo4jEpochToDate(verificationRequest.expires),
        }
        : null;
};
exports.getVerificationRequest = getVerificationRequest;
const deleteVerificationRequest = async (neo4jSession, identifier, token, hashToken // TODO: correct type
) => {
    const hashedToken = hashToken(token);
    await neo4jSession.writeTransaction((tx) => tx.run(`
    MATCH (v:VerificationRequest { identifier: $identifier, token: $token })
    DETACH DELETE v
    RETURN count(v)
    `, { identifier, token: hashedToken }));
};
exports.deleteVerificationRequest = deleteVerificationRequest;
