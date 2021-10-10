"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = email;

var _crypto = require("crypto");

var _errorHandler = _interopRequireDefault(require("../../../adapters/error-handler"));

async function email(email, provider, options) {
  try {
    var _await$provider$gener, _provider$generateVer;

    const {
      baseUrl,
      basePath,
      adapter,
      logger
    } = options;
    const {
      createVerificationRequest
    } = (0, _errorHandler.default)(await adapter.getAdapter(options), logger);
    const secret = provider.secret || options.secret;
    const token = (_await$provider$gener = await ((_provider$generateVer = provider.generateVerificationToken) === null || _provider$generateVer === void 0 ? void 0 : _provider$generateVer.call(provider))) !== null && _await$provider$gener !== void 0 ? _await$provider$gener : (0, _crypto.randomBytes)(32).toString("hex");
    const url = `${baseUrl}${basePath}/callback/${encodeURIComponent(provider.id)}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    await createVerificationRequest(email, url, token, secret, provider, options);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}