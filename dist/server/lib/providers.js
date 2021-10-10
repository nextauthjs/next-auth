"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseProviders;

function parseProviders({
  providers = [],
  baseUrl,
  basePath
}) {
  return providers.map(provider => ({ ...provider,
    signinUrl: `${baseUrl}${basePath}/signin/${provider.id}`,
    callbackUrl: `${baseUrl}${basePath}/callback/${provider.id}`
  }));
}