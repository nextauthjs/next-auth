"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.decode = decode;
exports.getToken = getToken;
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _jose = _interopRequireDefault(require("jose"));

var _logger = _interopRequireDefault(require("./logger"));

const DEFAULT_SIGNATURE_ALGORITHM = "HS512";
const DEFAULT_ENCRYPTION_ALGORITHM = "A256GCM";
const DEFAULT_ENCRYPTION_ENABLED = false;
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;

async function encode({
  token = {},
  maxAge = DEFAULT_MAX_AGE,
  secret,
  signingKey,
  signingOptions = {
    expiresIn: `${maxAge}s`
  },
  encryptionKey,
  encryptionOptions = {
    alg: "dir",
    enc: DEFAULT_ENCRYPTION_ALGORITHM,
    zip: "DEF"
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED
} = {}) {
  const _signingKey = signingKey ? _jose.default.JWK.asKey(JSON.parse(signingKey)) : getDerivedSigningKey(secret);

  const signedToken = _jose.default.JWT.sign(token, _signingKey, signingOptions);

  if (encryption) {
    const _encryptionKey = encryptionKey ? _jose.default.JWK.asKey(JSON.parse(encryptionKey)) : getDerivedEncryptionKey(secret);

    return _jose.default.JWE.encrypt(signedToken, _encryptionKey, encryptionOptions);
  }

  return signedToken;
}

async function decode({
  secret,
  token,
  maxAge = DEFAULT_MAX_AGE,
  signingKey,
  verificationKey = signingKey,
  verificationOptions = {
    maxTokenAge: `${maxAge}s`,
    algorithms: [DEFAULT_SIGNATURE_ALGORITHM]
  },
  encryptionKey,
  decryptionKey = encryptionKey,
  decryptionOptions = {
    algorithms: [DEFAULT_ENCRYPTION_ALGORITHM]
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED
} = {}) {
  if (!token) return null;
  let tokenToVerify = token;

  if (encryption) {
    const _encryptionKey = decryptionKey ? _jose.default.JWK.asKey(JSON.parse(decryptionKey)) : getDerivedEncryptionKey(secret);

    const decryptedToken = _jose.default.JWE.decrypt(token, _encryptionKey, decryptionOptions);

    tokenToVerify = decryptedToken.toString("utf8");
  }

  const _signingKey = verificationKey ? _jose.default.JWK.asKey(JSON.parse(verificationKey)) : getDerivedSigningKey(secret);

  return _jose.default.JWT.verify(tokenToVerify, _signingKey, verificationOptions);
}

async function getToken(params) {
  var _req$headers$authoriz;

  const {
    req,
    secureCookie = !(!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.startsWith("http://")),
    cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token",
    raw = false,
    decode: _decode = decode
  } = params;
  if (!req) throw new Error("Must pass `req` to JWT getToken()");
  let token = req.cookies[cookieName];

  if (!token && ((_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(" ")[0]) === "Bearer") {
    const urlEncodedToken = req.headers.authorization.split(" ")[1];
    token = decodeURIComponent(urlEncodedToken);
  }

  if (raw) {
    return token;
  }

  try {
    return _decode({
      token,
      ...params
    });
  } catch (_unused) {
    return null;
  }
}

let DERIVED_SIGNING_KEY_WARNING = false;
let DERIVED_ENCRYPTION_KEY_WARNING = false;

function hkdf(secret, {
  byteLength,
  encryptionInfo,
  digest = "sha256"
}) {
  if (_crypto.default.hkdfSync) {
    return Buffer.from(_crypto.default.hkdfSync(digest, secret, Buffer.alloc(0), encryptionInfo, byteLength));
  }

  return require("futoin-hkdf")(secret, byteLength, {
    info: encryptionInfo,
    hash: digest
  });
}

function getDerivedSigningKey(secret) {
  if (!DERIVED_SIGNING_KEY_WARNING) {
    _logger.default.warn("JWT_AUTO_GENERATED_SIGNING_KEY");

    DERIVED_SIGNING_KEY_WARNING = true;
  }

  const buffer = hkdf(secret, {
    byteLength: 64,
    encryptionInfo: "NextAuth.js Generated Signing Key"
  });

  const key = _jose.default.JWK.asKey(buffer, {
    alg: DEFAULT_SIGNATURE_ALGORITHM,
    use: "sig",
    kid: "nextauth-auto-generated-signing-key"
  });

  return key;
}

function getDerivedEncryptionKey(secret) {
  if (!DERIVED_ENCRYPTION_KEY_WARNING) {
    _logger.default.warn("JWT_AUTO_GENERATED_ENCRYPTION_KEY");

    DERIVED_ENCRYPTION_KEY_WARNING = true;
  }

  const buffer = hkdf(secret, {
    byteLength: 32,
    encryptionInfo: "NextAuth.js Generated Encryption Key"
  });

  const key = _jose.default.JWK.asKey(buffer, {
    alg: DEFAULT_ENCRYPTION_ALGORITHM,
    use: "enc",
    kid: "nextauth-auto-generated-encryption-key"
  });

  return key;
}

var _default = {
  encode,
  decode,
  getToken
};
exports.default = _default;