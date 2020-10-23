"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oauth = require("oauth");

var _default = provider => {
  if (provider.version && provider.version.startsWith('2.')) {
    var basePath = new URL(provider.authorizationUrl).origin;
    var authorizePath = new URL(provider.authorizationUrl).pathname;
    var accessTokenPath = new URL(provider.accessTokenUrl).pathname;
    return new _oauth.OAuth2(provider.clientId, provider.clientSecret, basePath, authorizePath, accessTokenPath, provider.headers);
  } else {
    return new _oauth.OAuth(provider.requestTokenUrl, provider.accessTokenUrl, provider.clientId, provider.clientSecret, provider.version || '1.0', provider.callbackUrl, provider.encoding || 'HMAC-SHA1');
  }
};

exports.default = _default;