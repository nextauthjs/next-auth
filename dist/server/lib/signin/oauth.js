"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAuthorizationUrl;

var _client = _interopRequireDefault(require("../oauth/client"));

var _logger = _interopRequireDefault(require("../../../lib/logger"));

async function getAuthorizationUrl(req) {
  var _req$query, _provider$version;

  const {
    provider
  } = req.options;
  (_req$query = req.query) === null || _req$query === void 0 ? true : delete _req$query.nextauth;
  const params = { ...provider.authorizationParams,
    ...req.query
  };
  const client = (0, _client.default)(provider);

  if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith('2.')) {
    let url = client.getAuthorizeUrl({
      scope: provider.scope,
      ...params,
      redirect_uri: provider.callbackUrl
    });

    if (provider.authorizationUrl.includes('?')) {
      const parseUrl = new URL(provider.authorizationUrl);
      const baseUrl = `${parseUrl.origin}${parseUrl.pathname}?`;
      url = url.replace(baseUrl, provider.authorizationUrl + '&');
    }

    _logger.default.debug('GET_AUTHORIZATION_URL', url);

    return url;
  }

  try {
    const tokens = await client.getOAuthRequestToken(params);
    const url = `${provider.authorizationUrl}?${new URLSearchParams({
      oauth_token: tokens.oauth_token,
      oauth_token_secret: tokens.oauth_token_secret,
      ...tokens.params
    })}`;

    _logger.default.debug('GET_AUTHORIZATION_URL', url);

    return url;
  } catch (error) {
    _logger.default.error('GET_AUTHORIZATION_URL_ERROR', error);

    throw error;
  }
}