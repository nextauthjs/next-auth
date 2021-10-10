"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSecret;

var _crypto = require("crypto");

function createSecret({
  userOptions,
  basePath,
  baseUrl
}) {
  return userOptions.secret || (0, _crypto.createHash)('sha256').update(JSON.stringify({
    baseUrl,
    basePath,
    ...userOptions
  })).digest('hex');
}